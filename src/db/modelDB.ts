import { DBSchema, IDBPDatabase, openDB } from "idb/with-async-ittr";
import { v4 as uuidv4 } from "uuid";
import { DBModel, DBModelChunk, DBTokenizer } from "./types";
import { AvailableModels } from "../models";
import { Result } from "true-myth";
import pRetry from "p-retry";

interface ModelDBSchema extends DBSchema {
    models: {
        value: DBModel;
        key: string;
        indexes: { modelID: string };
    };
    modelChunks: {
        value: DBModelChunk;
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
                modelStore.createIndex("modelID", "ID");

                const modelChunkStore = db.createObjectStore("modelChunks");
                modelChunkStore.createIndex("modelID", "modelID");

                db.createObjectStore("availableModels");

                const tokenizerStore = db.createObjectStore("tokenizer");
                tokenizerStore.createIndex("modelID", "modelID");
            },
        });

        return new ModelDB(db);
    }

    private async fetchBytes(
        url: string,
        onProgress?: (progress: number) => void
    ): Promise<Result<Uint8Array[], Error>> {
        const chunkSize = 128 * 1024 * 1024;
        const run = async () => {
            const response = await fetch(url);
            if (!response.ok) {
                return Result.err<Uint8Array[], Error>(
                    new Error(`Fetch failed: ${response.status}`)
                );
            }
            const contentLength = +response.headers.get("Content-Length")!;

            const reader = response.body!.getReader();
            let receivedLength = 0;
            const chunks: Uint8Array[] = Array(
                Math.ceil(contentLength / chunkSize)
            );
            let currentChunk = 0;
            let currentChunkLength = 0;
            for (;;) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }
                if (currentChunkLength + value.length > chunkSize) {
                    currentChunk++;
                    currentChunkLength = 0;
                }
                chunks[currentChunk].set(value, currentChunkLength);

                receivedLength += value.length;
                if (onProgress) {
                    onProgress((receivedLength / contentLength) * 100);
                }
            }
            return Result.ok<Uint8Array[], Error>(chunks);
        };
        return await pRetry(run, { retries: 3 });
    }

    async _getModel(modelID: string): Promise<Result<DBModel, Error>> {
        if (!this.db) {
            return Result.err(new Error("ModelDB not initialized"));
        }

        const tx = this.db.transaction("models", "readonly");
        const store = tx.objectStore("models");
        const model = await store.get(modelID);
        await tx.done;

        if (!model) {
            return Result.err(new Error("Model not found"));
        }
        return Result.ok(model);
    }

    async getModelChunks(modelID: string): Promise<Result<DBModelChunk[], Error>> {
        if (!this.db) {
            return Result.err(new Error("ModelDB not initialized"));
        }

        const tx = this.db.transaction("modelChunks", "readonly");
        const store = tx.objectStore("modelChunks");
        const chunks = await store.getAll(modelID);
        await tx.done;

        if (!chunks) {
            return Result.err(new Error("Model chunks not found"));
        }
        return Result.ok(chunks);
    }

    async getTokenizer(modelID: string): Promise<Result<DBTokenizer, Error>> {
        if (!this.db) {
            return Result.err(new Error("ModelDB not initialized"));
        }

        let tokenizer = await this.db.getFromIndex(
            "tokenizer",
            "modelID",
            modelID
        );

        if (!tokenizer) {
            const tokenizerBytes = await this.fetchBytes(
                "https://huggingface.co/openai/whisper-large-v2/raw/main/tokenizer.json"
            );
            if (tokenizerBytes.isErr) {
                return Result.err(tokenizerBytes.error);
            }
            const tokenizerBytesValue = tokenizerBytes.value;
            if (tokenizerBytesValue.length !== 1) {
                return Result.err(
                    new Error("Tokenizer bytes should be a single chunk")
                );
            }
            tokenizer = {
                modelID,
                bytes: tokenizerBytesValue[0],
            };
            this.db.put("tokenizer", tokenizer, modelID);
        }

        return Result.ok(tokenizer!);
    }

    async getModel(
        model: AvailableModels,
        onProgress: (progress: number) => void
    ): Promise<Result<DBModel, Error>> {
        if (!this.db) {
            return Result.err(new Error("ModelDB not initialized"));
        }
        let modelID = await this.db.get("availableModels", model);
        if (!modelID) {
            await this.fetchRemote(model, onProgress);
            modelID = await this.db.get("availableModels", model);
        }
        return await this._getModel(modelID!);
    }

    async fetchRemote(
        model: AvailableModels,
        onProgress: (progress: number) => void
    ): Promise<Result<void, Error>> {
        const remoteURL = `${this.remoteUrl}/whisper-turbo/${model}-pf16-full.bin`;
        const fetchResult = await this.fetchBytes(remoteURL, onProgress);

        if (fetchResult.isErr) {
            return Result.err(fetchResult.error);
        }
        const modelChunks = fetchResult.value;
        const modelID = uuidv4();
        for (const [chunkIndex, chunk] of modelChunks.entries()) {
            const dbModelChunk = {
                chunk,
                chunkIndex,
                modelID,
            };
            this.db!.put("modelChunks", dbModelChunk, modelID);
        }

        this.db!.put("availableModels", modelID, model);

        const dbModel = { name: model, ID: modelID };
        this.db!.put("models", dbModel, modelID);
        this.getTokenizer(modelID);
        return Result.ok(undefined);
    }
}
