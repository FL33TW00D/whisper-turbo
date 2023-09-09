import { DBSchema, IDBPDatabase, openDB } from "idb/with-async-ittr";
import { v4 as uuidv4 } from "uuid";
import {
    DBModel,
    DBTensor,
    DBConfig,
    DBTokenizer,
    ModelWithKey,
} from "./types";
import pLimit from "p-limit";
import { AvailableModels } from "../models";
import { Result } from "true-myth";
import pRetry from "p-retry";

const concurrentFetch = pLimit(4);

interface ModelDBSchema extends DBSchema {
    models: {
        value: DBModel;
        key: string;
        indexes: { parentID: string; tensorsIDs: string[] };
    };
    availableModels: {
        value: string; //parentID
        key: AvailableModels;
    };
    tokenizer: {
        value: DBTokenizer;
        key: string;
        indexes: { parentID: string };
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
                db.createObjectStore("availableModels");
                const model_store = db.createObjectStore("models");
                model_store.createIndex("parentID", "parentID");
                const tokenizer_store = db.createObjectStore("tokenizer");
                tokenizer_store.createIndex("parentID", "parentID");
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

    async _getModels(parentID: string): Promise<Result<ModelWithKey[], Error>> {
        console.log("Attempting to get models");
        if (!this.db) {
            return Result.err(new Error("ModelDB not initialized"));
        }

        const tx = this.db.transaction("models", "readonly");
        const index = tx.store.index("parentID");

        let models: ModelWithKey[] = [];
        for await (const cursor of index.iterate(parentID.toString())) {
            models.push({ id: cursor.key, model: cursor.value });
        }

        await tx.done;

        models.sort((a, b) => a.model.index - b.model.index);
        return Result.ok(models);
    }

    async getTokenizer(parentID: string): Promise<Result<DBTokenizer, Error>> {
        console.log("Attempting to get tokenizer");
        if (!this.db) {
            return Result.err(new Error("ModelDB not initialized"));
        }

        let tokenizer = await this.db.getAllFromIndex(
            "tokenizer",
            "parentID",
            parentID.toString()
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
        let parentID = await this.db.get("availableModels", model);
        console.log("Found existing model ID: ", parentID);
        if (!parentID) {
            await this.fetchBundle(model);
            parentID = await this.db.get("availableModels", model);
        }

        let storedModels = await this._getModels(parentID!);

        return storedModels;
    }

    async insertModel(
        definition: string,
        tensorIDs: string[],
        index: number,
        parentID: string,
        bytes: Uint8Array
    ): Promise<string> {
        let dbModel = { name: definition, parentID, bytes, index, tensorIDs };
        let componentID = uuidv4();
        this.db!.put("models", dbModel, componentID);
        return componentID;
    }

    private async fetchBundle(
        modelName: AvailableModels
    ): Promise<Result<void, Error>> {
        if (!this.db) {
            return Result.err(new Error("ModelDB not initialized"));
        }
        let parentID = uuidv4();
        this.db!.put("availableModels", parentID, modelName);

        let model_definition = await fetch(
            `${this.remoteUrl}/${modelName}/model_definition.json`
        ).then((resp) => resp.json());

        for (let [index, model] of model_definition.models.entries()) {
            let tensorPromises = model.tensors.map((tensorKey: string) => {
                return concurrentFetch(async () => {
                    let existingID = await this.tensorExists(tensorKey);
                    if (existingID.isOk) {
                        return existingID.value;
                    }

                    let tensorResult = await this.fetchBytes(
                        `${this.remoteUrl}/${modelName}/${tensorKey}`
                    );

                    if (tensorResult.isErr) {
                        return Promise.reject(tensorResult.error);
                    }

                    let tensorBytes = tensorResult.value;

                    return await this.insertTensor(tensorKey, tensorBytes);
                });
            });

            let tensorIDs = await Promise.all(tensorPromises);

            let definitionResult = await this.fetchBytes(
                `${this.remoteUrl}/${modelName}/${model.definition}`
            );
            if (definitionResult.isErr) {
                return Result.err(definitionResult.error);
            }
            let definitionBytes = definitionResult.value;

            await this.insertModel(
                model.definition,
                tensorIDs,
                index,
                parentID,
                definitionBytes
            );
        }

        let config = await this.fetchBytes(
            `${this.remoteUrl}/${modelName}/config.json`
        );

        if (config.isErr) {
            return Result.err(config.error);
        } else {
            this.db!.put(
                "config",
                {
                    bytes: config.value,
                    parentID: parentID,
                },
                parentID
            );
        }

        let parsedConfig = JSON.parse(new TextDecoder().decode(config.value));
        if (parsedConfig.requires_tokenizer) {
            console.warn("Requires tokenizer");
            let tokenizer = await this.fetchBytes(
                `${this.remoteUrl}/${modelName}/tokenizer.json`
            );

            if (tokenizer.isErr) {
                return Result.err(tokenizer.error);
            } else {
                this.db!.put(
                    "tokenizer",
                    {
                        bytes: tokenizer.value,
                        parentID: parentID,
                    },
                    parentID
                );
            }
        }
        return Result.ok(undefined);
    }
}
