import { useState } from "react";
import { MicRecorder } from "whisper-turbo";

interface MicButtonProps {
    setBlobUrl: (blobUrl: string) => void;
    setAudioData: (audioData: Uint8Array) => void;
    setAudioMetadata: (audioMetadata: File) => void;
}

const MicButton = (props: MicButtonProps) => {
    const [mic, setMic] = useState<MicRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    const handleRecord = async () => {
        setMic(await MicRecorder.start());
    };

    const handleStop = async () => {
        if (!mic) {
            return;
        }
        let recording = await mic.stop();
        let blob = recording.blob;
        props.setBlobUrl(URL.createObjectURL(blob));
        props.setAudioData(new Uint8Array(await blob.arrayBuffer()));
        props.setAudioMetadata(new File([blob], "recording.wav"));
        setMic(null);
    };

    const handleClick = async () => {
        if (isRecording) {
            await handleStop();
        } else {
            await handleRecord();
        }
        setIsRecording(!isRecording);
    };

    return (
        <div className="flex flex-col">
            <label className="text-white text-xl font-semibold">Record</label>
            <button
                className="bg-pop-orange text-xl outline outline-white text-white font-semibold px-6 mx-auto cursor-pointer active:bg-pop-orange-dark h-full"
                onClick={handleClick}
            >
                {isRecording ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
                            clipRule="evenodd"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                        />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default MicButton;
