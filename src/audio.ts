import fixWebmDuration from "fix-webm-duration";

export interface Recording {
    blob: Blob;
    pcm: ArrayBuffer;
}

export class MicRecorder {
    private currentStart: number | null = null;
    private currentStream: MediaStream | null = null;
    private inner: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private static readonly supportedMimes = [
        "audio/webm", // Chrome
        "audio/ogg", // Firefox
    ];

    private constructor(recorder: MediaRecorder) {
        this.inner = recorder;
    }

    public static async start(): Promise<MicRecorder> {
        if (!navigator.mediaDevices) {
            throw new Error("Media device not available");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        const inner = new MediaRecorder(stream, {
            mimeType: MicRecorder.supportedMimes.find((mime: string) =>
                MediaRecorder.isTypeSupported(mime)
            ),
        });
        const recorder = new MicRecorder(inner);
        recorder.currentStream = stream;

        inner.addEventListener("dataavailable", (event) => {
            recorder.audioChunks.push(event.data);
        });
        inner.start();
        recorder.currentStart = Date.now();
        return recorder;
    }

    public isRecording(): boolean {
        return this.inner !== null && this.inner.state === "recording";
    }

    public async stop(): Promise<Recording> {
        if (!this.inner) {
            throw new Error("Please start the recorder first");
        }

        return new Promise<Recording>((resolve) => {
            this.inner!.addEventListener("stop", async () => {
                const duration = Date.now() - this.currentStart!;
                let blob = new Blob(this.audioChunks, {
                    type: this.inner!.mimeType,
                });
                
                if (this.inner!.mimeType.includes("webm")) {
                    blob = await fixWebmDuration(blob, duration, {logger: false})
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        blob,
                        pcm: reader.result as ArrayBuffer,
                    });
                };
                reader.readAsArrayBuffer(blob);
            });
            this.inner!.stop();
            this.currentStream!.getTracks().forEach((track) => track.stop());
        });
    }
}

export default MicRecorder;
