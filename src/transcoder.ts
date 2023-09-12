import { FFmpeg } from "@ffmpeg/ffmpeg";

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
    ffmpeg: FFmpeg;

    private readonly sampleRate = 16000;

    constructor() {
        this.ffmpeg = new FFmpeg();
    }

    command = (name: string) => {
        return `-i ${name} -ac 1 -ar ${this.sampleRate} -acodec pcm_s16le -f wav output.wav`;
    };

    transcode = async (name: string, data: Uint8Array): Promise<Uint8Array> => {
        await this.ffmpeg.writeFile(name, data);
        await this.ffmpeg.exec([this.command(name)]);
        const fileData = await this.ffmpeg.readFile('output.wav');
        if (fileData instanceof Uint8Array) {
            return fileData;
        }else {
            throw new Error("Failed to transcode file");
        }
    };
}
