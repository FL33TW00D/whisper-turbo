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
        "audio/webm", //Chrome
        "audio/ogg", //Firefox
    ];
    private audioChunks: Blob[] = [];

    private constructor(recorder: MediaRecorder, audioChunks: Blob[]) {
        this.recorder = recorder;
        this.audioChunks = audioChunks;
    }

    public static async start(): Promise<MicRecorder> {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });

        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: this.supportedMimes.find((mime: string) =>
                MediaRecorder.isTypeSupported(mime)
            ),
        });

        console.log("Selected mime: ", mediaRecorder.mimeType);

        const audioChunks: Blob[] = [];
        mediaRecorder.addEventListener("dataavailable", (event: BlobEvent) => {
            audioChunks.push(event.data);
        });

        const recorder = new MicRecorder(mediaRecorder, audioChunks);
        recorder.recorder!.start();
        return recorder;
    }

    public isRecording(): boolean {
        return this.recorder?.state === "recording";
    }

    public stop(): Promise<void> {
        return new Promise((resolve, rejected) => {
            this.recorder?.addEventListener("error", (event) => {
                rejected(event);
            });
            this.recorder?.addEventListener("stop", () => {
                resolve();
            });
            this.recorder?.stop();
            this.recorder = null;
        });
    }

    public getBlob(): Blob {
        return new Blob(this.audioChunks);
    }
}

export default MicRecorder;
