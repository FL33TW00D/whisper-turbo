/**
 * A class that handles recording audio from the microphone.
 * @remarks
 * This class is a wrapper around the MediaRecorder API.
 * @example
 * ```typescript
 * const recorder = await MicRecorder.create();
 * recorder.start();
 * recorder.stop();
 * const blob = await recorder.getBlob();
 * ```
 */
export class MicRecorder {
    private recorder: MediaRecorder | null = null;
    private static readonly supportedMimes = [
        "audio/mp4",
        "audio/mp3",
        "audio/wav",
        "audio/aac",
        "audio/m4a",
    ];
    private audioChunks: Blob[] = [];

    private constructor(recorder: MediaRecorder, audioChunks: Blob[]) {
        this.recorder = recorder;
        this.audioChunks = audioChunks;
    }

    public static async create(): Promise<MicRecorder> {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });

        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: this.supportedMimes.find((mime: string) =>
                MediaRecorder.isTypeSupported(mime)
            ),
        });

        const audioChunks: Blob[] = [];
        mediaRecorder.addEventListener("dataavailable", (event: BlobEvent) => {
            audioChunks.push(event.data);
        });

        return new MicRecorder(mediaRecorder, audioChunks);
    }

    public start(): void {
        this.recorder?.start();
    }

    public stop(): void {
        this.recorder?.stop();
    }

    public getBlob(): Blob {
        return new Blob(this.audioChunks);
    }
}

export default MicRecorder;
