import * as Comlink from "comlink";
import ModelDB from "./db/modelDB";
import { Result } from "true-myth";

export interface GenerationConfig {
    max_length: number;
    temperature: number;
    top_k: number;
    top_p: number;
    repetition_penalty: number;
}

export class Session {
    rumbleSession: rumble.Session | undefined;

    private async loadModel(
        model: AvailableModels
    ): Promise<Result<Model[], Error[]>> {
        let db = await ModelDB.create();
        const dbModelsResult = await db.getModels(model);
        if (dbModelsResult.isErr) {
            return Result.err([new Error("Model not found")]);
        }
        const dbModels = dbModelsResult.value;

        let failedModels: Error[] = [];
        const modelResults = await Promise.all(
            dbModels.map(async (m) => {
                const model = await Model.fromDBModel(m.model, db);
                if (model.isErr) {
                    failedModels.push(model.error);
                }
                return model;
            })
        );
        if (failedModels.length > 0) {
            return Result.err(failedModels);
        }
        const models = modelResults.map((r) => r.unwrapOr(undefined)!);

        return Result.ok(models);
    }

    private async initStandalone(model: Model): Promise<Result<void, Error>> {
        await rumble.default();
        const session_builder = new rumble.SessionBuilder();
        let session = session_builder.addModel(model.intoDefinition());
        if (model.config) {
            session = session.setConfig(model.config);
        }
        if (model.tokenizer) {
            session = session.setTokenizer(model.tokenizer);
        }

        try {
            let sessionResult = await session.build();
            console.warn("Session result: ", JSON.stringify(sessionResult));
            this.rumbleSession = sessionResult;
            return Result.ok(undefined);
        } catch (e) {
            console.error("Failed to build session: ", e);
            return Result.err(new Error("Failed to build session"));
        }
    }

    private async initEncoderDecoder(
        models: Model[]
    ): Promise<Result<void, Error>> {
        await rumble.default();

        if (models.length !== 2) {
            return Result.err(
                new Error(
                    "Failed to construct encoder-decoder session. Requires 2 models, got " +
                        models.length
                )
            );
        }

        const session_builder = new rumble.SessionBuilder();
        const encoder = models[0].intoDefinition();
        const decoder = models[1].intoDefinition();
        const config = models[0].config;
        const tokenizer = models[0].tokenizer;

        if (!config || !tokenizer) {
            return Result.err(
                new Error(
                    "Failed to construct encoder-decoder session. Models must have config and tokenizer"
                )
            );
        }

        this.rumbleSession = await session_builder
            .addModel(encoder)
            .addModel(decoder)
            .setConfig(config!)
            .setTokenizer(tokenizer!)
            .build();

        return Result.ok(undefined);
    }

    public async initSession(
        model: AvailableModels
    ): Promise<Result<void, Error>> {
        console.error("Initializing session with model: ", model);
        if (this.rumbleSession) {
            return Result.err(
                new Error(
                    "Session already initialized. Call `destroy()` first."
                )
            );
        }
        let modelResult = await this.loadModel(model);
        if (modelResult.isErr) {
            console.error("Returning error: ", modelResult.error);
            return Result.err(new Error("Failed to load model"));
        }
        let models = modelResult.value;

        switch (models.length) {
            case 1:
                return await this.initStandalone(models[0]);
            case 2:
                return await this.initEncoderDecoder(models);
            default:
                throw new Error("Invalid number of models: " + models.length);
        }
    }

    public async run(
        input: Map<string, any>,
        callback: (result: string) => void,
        generation_config?: GenerationConfig
    ): Promise<Result<void, Error>> {
        if (!this.rumbleSession) {
            return Result.err(
                new Error(
                    "The session is not initialized. Call `initSession()` method first."
                )
            );
        }

        let sessionInput = new rumble.SessionEvent(
            input,
            callback,
            generation_config
        );
        console.log("Running session with input: ", sessionInput);

        return Result.ok(await this.rumbleSession.run(sessionInput));
    }
}

if (typeof self !== "undefined") {
    Comlink.expose(Session);
}

