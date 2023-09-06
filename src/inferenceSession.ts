import { Session } from "./session.worker";
import * as Comlink from "comlink";
import { Result } from "true-myth";

/// Abstracts over a session running in a web worker
/// or in the main thread.
export class InferenceSession {
    private session: Comlink.Remote<Session> | Session | null;

    constructor(session: Comlink.Remote<Session> | Session) {
        this.session = session;
    }

    async initSession(model_bytes: Uint8Array, tokenizer_bytes: Uint8Array): Promise<Result<void, Error>> {
        return await this.session!.initSession(model_bytes, tokenizer_bytes);
    }

    public async run(audio: Float64Array): Promise<Result<string, Error>> {
        if (this.session instanceof Session) {
            return await this.session.run(audio);
        } else {
            return await this.session!.run(audio);
        }
    }

    public destroy(): void {
        this.session = null;
    }
}
