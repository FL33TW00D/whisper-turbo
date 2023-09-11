import { DBSchema, IDBPDatabase, openDB } from "idb/with-async-ittr";
import { v4 as uuidv4 } from "uuid";
import { DBModel, DBTokenizer } from "./types";
import { AvailableModels } from "../models";
import { Result } from "true-myth";
import pRetry from "p-retry";

interface ModelDBSchema extends DBSchema {
    models: {
        value: DBModel;
        key: string;
        indexes: { modelID: string };
    };
    availableModels: {
        value: string;
        key: AvailableModels;
    };
    tokenizer: {
        value: DBTokenizer;
        key: string;
        indexes: { modelID: string };
    };
}

/**
 * A class that represents a database of models and related data.
 *
 * @remarks
 * The `ModelDB` class uses the IndexedDB API to store and retrieve data. The database schema is defined by the `ModelDBSchema` interface.
 *
 * To use the `ModelDB` class, first create an instance by calling the constructor. Then call the `init` method to open the database.
 *
 * Example usage:
 *
 * ```typescript
 * ```
 */
export default class ModelDB {
    private readonly remoteUrl = "https://rmbl.us";
    private db: IDBPDatabase<ModelDBSchema> | null;

    private constructor(db: IDBPDatabase<ModelDBSchema>) {
        this.db = db;
    }

    public static async create(): Promise<ModelDB> {
        const db = await openDB<ModelDBSchema>("models", 1, {
            upgrade(db) {
                const modelStore = db.createObjectStore("models");
                modelStore.createIndex("modelID", "modelID");
                db.createObjectStore("availableModels");
                const tokenizerStore = db.createObjectStore("tokenizer");
                tokenizerStore.createIndex("modelID", "modelID");
            },
        });

        return new ModelDB(db);
    }

    private async fetchBytes(url: string): Promise<Result<Uint8Array, Error>> {
        const run = async () => {
            const response = await fetch(url);
            if (response.status >= 400) {
                throw new Error(response.statusText);
            }
            return response.arrayBuffer();
        };
        const bytes = await pRetry(run, { retries: 3 });
        if (bytes instanceof Error) {
            return Result.err(bytes);
        }
        return Result.ok(new Uint8Array(bytes));
    }

    async _getModel(modelID: string): Promise<Result<DBModel, Error>> {
        if (!this.db) {
            return Result.err(new Error("ModelDB not initialized"));
        }

        const tx = this.db.transaction("models", "readonly");
        const store = tx.objectStore("models");
        const model = await store.get(modelID);

        if (!model) {
            return Result.err(new Error("Model not found"));
        }
        return Result.ok(model);
    }

    async getTokenizer(modelID: string): Promise<Result<DBTokenizer, Error>> {
        console.log("Getting tokenizer for model: ", modelID);
        if (!this.db) {
            return Result.err(new Error("ModelDB not initialized"));
        }

        let tokenizer = await this.db.getFromIndex(
            "tokenizer",
            "modelID",
            modelID
        );
        console.log("Found existing tokenizer: ", tokenizer);

        if (!tokenizer) {
            console.log("Fetching tokenizer from remote");
            const tokenizerBytes = await this.fetchBytes(
                "https://huggingface.co/openai/whisper-large-v2/raw/main/tokenizer.json"
            );
            if (tokenizerBytes.isErr) {
                return Result.err(tokenizerBytes.error);
            }
            const tokenizerBytesValue = tokenizerBytes.value;
            console.log("Tokenizer bytes: ", tokenizerBytes);
            tokenizer = {
                modelID,
                bytes: tokenizerBytesValue,
            };
            this.db.put("tokenizer", tokenizer, modelID);
            tokenizer = await this.db.getFromIndex(
                "tokenizer",
                "modelID",
                modelID
            );
        }

        return Result.ok(tokenizer!);
    }

    async getModel(model: AvailableModels): Promise<Result<DBModel, Error>> {
        if (!this.db) {
            return Result.err(new Error("ModelDB not initialized"));
        }
        let modelID = await this.db.get("availableModels", model);
        console.log("Found existing model ID: ", modelID);
        if (!modelID) {
            await this.fetchRemote(model);
            modelID = await this.db.get("availableModels", model);
        }
        return await this._getModel(modelID!);
    }

    async fetchRemote(model: AvailableModels): Promise<Result<void, Error>> {
        const remoteURL = `${this.remoteUrl}/whisper-turbo/${model}-pf16-full.bin`;
        console.log("Fetching model from: ", remoteURL);
        const fetchResult = await this.fetchBytes(remoteURL);

        if (fetchResult.isErr) {
            return Result.err(fetchResult.error);
        }
        const data = fetchResult.value;

        const modelID = uuidv4();
        this.db!.put("availableModels", modelID, model);
        const dbModel = { name: model, ID: modelID, bytes: data };
        this.db!.put("models", dbModel, modelID);
        this.getTokenizer(modelID);

        return Result.ok(undefined);
    }
}
