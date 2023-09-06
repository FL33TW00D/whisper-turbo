import * as whisper from "whisper-webgpu";
import * as Comlink from "comlink";
import { Result } from "true-myth";
import { ok } from "true-myth/dist/public/result";

export interface GenerationConfig {
    max_length: number;
    temperature: number;
    top_k: number;
    top_p: number;
    repetition_penalty: number;
}

export class Session {
    rumbleSession: whisper.Session | undefined;

    public async initSession(
        tok_bytes: Uint8Array,
        model_bytes: Uint8Array
    ): Promise<Result<void, Error>> {
        const builder = new whisper.SessionBuilder();
        builder.setModel(model_bytes);
        builder.setTokenizer(tok_bytes);
        const session = await builder.build();
        this.rumbleSession = session;
        return ok(undefined);
    }
}

if (typeof self !== "undefined") {
    Comlink.expose(Session);
}
