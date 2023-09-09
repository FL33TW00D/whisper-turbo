import * as whisper from "whisper-webgpu";
import * as Comlink from "comlink";
import { Result } from "true-myth";

export class Session {
    whisperSession: whisper.Session | undefined;

    public async initSession(
        model_bytes: Uint8Array,
        tok_bytes: Uint8Array
    ): Promise<Result<void, Error>> {
        await whisper.default();
        const builder = new whisper.SessionBuilder();
        const session = await builder
            .setModel(model_bytes)
            .setTokenizer(tok_bytes)
            .build();
        this.whisperSession = session;
        return Result.ok(undefined);
    }

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


    public async run(audio: Uint8Array): Promise<Result<string, Error>> {
        if (!this.whisperSession) {
            return Result.err(
                new Error(
                    "The session is not initialized. Call `initSession()` method first."
                )
            );
        }

        return Result.ok(await this.whisperSession.run(audio));
    }

    public async stream(
        audio: Uint8Array,
        callback: (decoded: string) => void
    ): Promise<Result<void, Error>> {
        if (!this.whisperSession) {
            return Result.err(
                new Error(
                    "The session is not initialized. Call `initSession()` method first."
                )
            );
        }

        return Result.ok(await this.whisperSession.stream(audio, callback));
    }
}

if (typeof self !== "undefined") {
    Comlink.expose(Session);
}
