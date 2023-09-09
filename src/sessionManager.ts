import { InferenceSession } from "./inferenceSession";
import * as Comlink from "comlink";
import { Session } from "./session.worker";
import { AvailableModels } from "./models";
import { Result } from "true-myth";

export class SessionManager {
    /**
     * Loads a model and returns a Session instance.
     * @param model - The model to load.
     * @param onLoaded - A callback that is called when the model is loaded.
     * @returns A Promise that resolves with a Session instance.
     *
     */
    public async loadModel(
        selectedModel: AvailableModels,
        onLoaded: (result: any) => void
    ): Promise<Result<InferenceSession, Error>> {
        console.error("Starting model load...");
        const creationResult = await this.createSession(true, modelBytes, tokenizerBytes);
        if(creationResult.isErr){
            return Result.err(creationResult.error);
        }
        onLoaded(creationResult.value);
        return Result.ok(creationResult.value);
    }

    /**
     * Creates a new session with the specified models.
     *
     * @param spawnWorker - Determines whether a Web Worker should be used for the session.
     * @param model - The model to use for the session.
     * @returns A Promise that resolves with a Session instance, or a Remote<Session> instance if a Web Worker was used.
     *
     */
    private async createSession(
        spawnWorker: boolean,
        selectedModel: AvailableModels,
    ): Promise<Result<InferenceSession, Error>> {
        if (spawnWorker && typeof document !== "undefined") {
            console.error("Spawning worker...");
            const SessionWorker = Comlink.wrap<typeof Session>(
                new Worker(new URL("./session.worker.js", import.meta.url), {
                    type: "module",
                })
            );
            const session = await new SessionWorker();
            const initResult = await session.initSession(selectedModel);
            //@ts-ignore fucking comlink
            if (initResult.repr[0] === "Err") {
                //@ts-ignore
                return Result.err(new Error("Session initialization failed: " + initResult.repr[1]));
            }
            return Result.ok(new InferenceSession(session));
        } else {
            const session = new Session();
            const initResult = await session.initSession(selectedModel);
            if (initResult.isErr) {
                console.error("Error initializing session: ", initResult);
                return Result.err(initResult.error);
            }
            return Result.ok(new InferenceSession(session));
        }
    }
}

