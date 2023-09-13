import { Session } from "./session.worker";
import * as Comlink from "comlink";
import { Result } from "true-myth";
import { AvailableModels } from "./models";
import { Transcoder } from "./transcoder";

//User facing API
export class InferenceSession {
    private session: Comlink.Remote<Session> | Session | null;
    private innerWorker: Worker | null; //Keep a reference to the worker so we can terminate it
    private transcoder: Transcoder | null;

    constructor(session: Comlink.Remote<Session> | Session, worker?: Worker) {
        this.session = session;
        this.innerWorker = worker || null;
        this.transcoder = null;
    }

    async initSession(
        selectedModel: AvailableModels,
        onProgress: (progress: number) => void
    ): Promise<Result<void, Error>> {
        this.transcoder = await Transcoder.create();
        return await this.session!.initSession(selectedModel, onProgress);
    }

    public async transcribe(audio: Uint8Array): Promise<Result<string, Error>>;

    public async transcribe(
        audio: Uint8Array,
        callback: (decoded: string) => void
    ): Promise<Result<void, Error>>;

    public async transcribe(
        audio: Uint8Array,
        callback?: (decoded: string) => void
    ): Promise<Result<string | void, Error>> {
        
    }

    public destroy(): void {
        if (this.innerWorker !== null) {
            console.warn("Terminating worker");
            this.innerWorker.terminate();
        }
        this.session = null;
    }
}
