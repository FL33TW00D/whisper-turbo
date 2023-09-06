import { GenerationConfig, Session } from "./session.worker";
import * as Comlink from "comlink";
import { AvailableModels } from "./models";
import { Result } from "true-myth";

/// Abstracts over a session running in a web worker
/// or in the main thread.
export class InferenceSession {
    private session: Comlink.Remote<Session> | Session | null;

    constructor(session: Comlink.Remote<Session> | Session) {
        this.session = session;
    }

    async initSession(model: AvailableModels): Promise<Result<void, Error>> {
        return await this.session!.initSession(model);
    }

    public async run(
        input: Map<string, any>,
        callback: (decoded: any) => void,
        generation_config?: GenerationConfig
    ): Promise<Result<void, Error>> {
        if (this.session instanceof Session) {
            return await this.session.run(input, callback, generation_config);
        } else {
            return await this.session!.run(
                input,
                Comlink.proxy(callback),
                generation_config
            );
        }
    }

    public destroy(): void {
        this.session = null;
    }
}
