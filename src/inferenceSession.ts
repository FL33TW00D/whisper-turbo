import { Session } from "./session.worker";
import * as Comlink from "comlink";
import { Result } from "true-myth";
import { AvailableModels } from "./models";

/// Abstracts over a session running in a web worker
/// or in the main thread.
export class InferenceSession {
    private session: Comlink.Remote<Session> | Session | null;

    constructor(session: Comlink.Remote<Session> | Session) {
        this.session = session;
    }

    async initSession(selectedModel: AvailableModels): Promise<Result<void, Error>> {
        return await this.session!.initSession(selectedModel);
    }

    public async run(audio: Uint8Array): Promise<Result<string, Error>> {
        if (this.session !== null) { 
            return await this.session!.run(audio);
        }else {
            return Result.err(new Error("Session not initialized"));
        }
    }

    public async stream(audio: Uint8Array, callback: (decoded: string) => void): Promise<Result<void, Error>> {
        if (this.session == null) {
            return Result.err(new Error("Session not initialized"));
        }else if (this.session instanceof Session) {
            return await this.session.stream(audio, callback);
        }else {
            return await this.session!.stream(audio, Comlink.proxy(callback));
        }
    }

    public destroy(): void {
        this.session = null;
    }
}
