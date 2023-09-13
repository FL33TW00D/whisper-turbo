import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

export enum AcceptedFormats {
    mp3 = "mp3",
    mp4 = "mp4",
    mpeg = "mpeg",
    mpga = "mpga",
    m4a = "m4a",
    wav = "wav",
    webm = "webm",
}

/// Thin layer over ffmpeg.wasm to transcode audio files to 16-bit WAV.
export class Transcoder {
    ffmpeg: FFmpeg | null = null;

    private readonly sampleRate = 16000;
    private readonly baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";

    private constructor() {}

    static async create() {
        const transcoder = new Transcoder();
        await transcoder.init();
        return transcoder;
    }

    async init(): Promise<Transcoder> {
        const ffmpeg = new FFmpeg();
        await ffmpeg.load({
            coreURL: await toBlobURL(
                `${this.baseURL}/ffmpeg-core.js`,
                "text/javascript"
            ),
            wasmURL: await toBlobURL(
                `${this.baseURL}/ffmpeg-core.wasm`,
                "application/wasm"
            ),
        });
        this.ffmpeg = ffmpeg;
        return this;
    }

    isWav = (bytes: Uint8Array): boolean => {
        const riff = "52 49 46 46";
        const wave = "57 41 56 45";

        const toHexString = (bytes: Uint8Array) => {
            return Array.from(bytes, (byte) => {
                return ("0" + (byte & 0xff).toString(16)).slice(-2);
            }).join("");
        };

        const startSignature = toHexString(bytes.slice(0, 4));
        const endSignature = toHexString(bytes.slice(8, 12));

        return startSignature === riff && endSignature === wave;
    };

    command = (name: string) => {
        return `-i ${name} -ac 1 -ar ${this.sampleRate} -acodec pcm_s16le -f wav output.wav`;
    };

    transcode = async (name: string, data: Uint8Array): Promise<Uint8Array> => {
        if (this.ffmpeg === null) {
            await this.init();
        }
        await this.ffmpeg!.writeFile(name, data);
        await this.ffmpeg!.exec([this.command(name)]);
        const fileData = await this.ffmpeg!.readFile("output.wav");
        if (fileData instanceof Uint8Array) {
            return fileData;
        } else {
            throw new Error("Failed to transcode file");
        }
    };
}
