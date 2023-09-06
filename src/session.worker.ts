import * as whisper from "whisper-webgpu";
import * as Comlink from "comlink";
import { Result } from "true-myth";
import { ok } from "true-myth/dist/public/result";

export class Session {
    whisperSession: whisper.Session | undefined;

    public async initSession(
        tok_bytes: Uint8Array,
        model_bytes: Uint8Array
    ): Promise<Result<void, Error>> {
        const builder = new whisper.SessionBuilder();
        builder.setModel(model_bytes);
        builder.setTokenizer(tok_bytes);
        const session = await builder.build();
        this.whisperSession = session;
        return ok(undefined);
    }

    public async run(
        audio: Float64Array,
    ): Promise<Result<string, Error>> {
        if (!this.whisperSession) {
            return Result.err(
                new Error(
                    "The session is not initialized. Call `initSession()` method first."
                )
            );
        }

        return Result.ok(await this.whisperSession.run(audio));
    }
}

if (typeof self !== "undefined") {
    Comlink.expose(Session);
}
