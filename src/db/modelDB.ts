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
 * const modelDB = new ModelDB();
 * await modelDB.init();
 * const model = await modelDB.getModels(AvailableModels.XYZ);
 * console.log(model);
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
                db.createObjectStore("models");
                const tokenizer_store = db.createObjectStore("tokenizer");
                tokenizer_store.createIndex("modelID", "modelID");
            },
        });

        return new ModelDB(db);
    }

    private async fetchBytes(url: string): Promise<Result<Uint8Array, Error>> {
        const run = async () => {
            const response = await fetch(url);
            if (response.status === 404) {
                throw new Error("404");
            }
            return response.arrayBuffer();
        };
        const bytes = await pRetry(run, { retries: 3 });
        if (bytes instanceof Error) {
            return Result.err(bytes);
        }
        return Result.ok(new Uint8Array(bytes));
    }

    async _getModels(modelID: string): Promise<Result<ModelWithKey[], Error>> {
        console.log("Attempting to get models");
        if (!this.db) {
            return Result.err(new Error("ModelDB not initialized"));
        }

        const tx = this.db.transaction("models", "readonly");
        const index = tx.store.index("modelID");

        let models: ModelWithKey[] = [];
        for await (const cursor of index.iterate(modelID.toString())) {
            models.push({ id: cursor.key, model: cursor.value });
        }

        await tx.done;

        models.sort((a, b) => a.model.index - b.model.index);
        return Result.ok(models);
    }

    async getTokenizer(modelID: string): Promise<Result<DBTokenizer, Error>> {
        console.log("Attempting to get tokenizer");
        if (!this.db) {
            return Result.err(new Error("ModelDB not initialized"));
        }

        const tokenizer = await this.db.getAllFromIndex(
            "tokenizer",
            "modelID",
            modelID.toString()
        );
        if (tokenizer.length !== 1) {
            return Result.err(
                new Error("Expected 1 tokenizer, got " + tokenizer.length)
            );
        }

        return Result.ok(tokenizer[0]);
    }

    async getModels(
        model: AvailableModels
    ): Promise<Result<ModelWithKey[], Error>> {
        if (!this.db) {
            return Result.err(new Error("ModelDB not initialized"));
        }
        let modelID = await this.db.get("availableModels", model);
        console.log("Found existing model ID: ", modelID);
        if (!modelID) {
            await this.fetchBundle(model);
            modelID = await this.db.get("availableModels", model);
        }

        let storedModels = await this._getModels(modelID!);

        return storedModels;
    }

    async insertModel(
        definition: string,
        tensorIDs: string[],
        index: number,
        modelID: string,
        bytes: Uint8Array
    ): Promise<string> {
        let dbModel = { name: definition, modelID, bytes, index, tensorIDs };
        let componentID = uuidv4();
        this.db!.put("models", dbModel, componentID);
        return componentID;
    }
}
