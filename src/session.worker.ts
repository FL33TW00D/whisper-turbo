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
        console.log("About to load model with bytes: ", model_bytes);
        builder.setModel(model_bytes);
        console.log("About to load tokenizer with bytes: ", tok_bytes);
        builder.setTokenizer(tok_bytes);
        const session = await builder.build();
        this.whisperSession = session;
        return Result.ok(undefined);
    }

    public async run(audio: Float64Array): Promise<Result<string, Error>> {
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
