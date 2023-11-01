import { useState, useRef, useEffect } from "react";
import {
    AvailableModels,
    InferenceSession,
    SessionManager,
} from "whisper-turbo";
import toast from "react-hot-toast";
import { humanFileSize } from "../util";
import ProgressBar from "./progressBar";
import ModelSelector from "./modelSelector";
import MicButton, { AudioMetadata } from "./micButton";

export interface TSSegment {
    text: string;
    start: number;
    stop: number;
    last: boolean;
}

export interface TSTranscript {
    segments: Array<TSSegment>;
}

interface ControlPanelProps {
    transcript: TSTranscript;
    setTranscript: React.Dispatch<React.SetStateAction<TSTranscript>>;
    setDownloadAvailable: React.Dispatch<React.SetStateAction<boolean>>;
}

const ControlPanel = (props: ControlPanelProps) => {
    const session = useRef<InferenceSession | null>(null);
    const [selectedModel, setSelectedModel] = useState<AvailableModels | null>(
        null
    );
    const [modelLoading, setModelLoading] = useState<boolean>(false);
    const [loadedModel, setLoadedModel] = useState<AvailableModels | null>(
        null
    );
    const [audioData, setAudioData] = useState<Uint8Array | null>(null);
    const [audioMetadata, setAudioMetadata] = useState<AudioMetadata | null>(
        null
    );
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [transcribing, setTranscribing] = useState<boolean>(false);

    useEffect(() => {
        if (loadedModel && selectedModel != loadedModel && !transcribing) {
            setLoaded(false);
            setProgress(0);
        }
    }, [selectedModel]);

    const handleAudioFile = () => async (event: any) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setAudioData(new Uint8Array(reader.result as ArrayBuffer));
            setAudioMetadata({
                file: file,
                fromMic: false,
            });
        };
        reader.readAsArrayBuffer(file);
    };

    /*
    useEffect(() => {
        if (audioData) {
            const url = URL.createObjectURL(new Blob([audioData]));
            setBlobUrl(url);
        }
    }, [audioData]);
    */

    const loadModel = async () => {
        if (session.current) {
            session.current.destroy();
        }
        if (modelLoading) {
            return;
        }
        if (!selectedModel) {
            console.error("No model selected");
            return;
        }
        setModelLoading(true);

        const manager = new SessionManager();
        const loadResult = await manager.loadModel(
            selectedModel,
            () => {
                setLoaded(true);
                setLoadedModel(selectedModel);
            },
            (p: number) => setProgress(p)
        );
        if (loadResult.isErr) {
            toast.error(loadResult.error.message);
        } else {
            setModelLoading(false);
            session.current = loadResult.value;
        }
    };

    const runSession = async () => {
        if (!session.current) {
            toast.error("No model loaded");
            return;
        }
        if (!audioData) {
            toast.error("No audio file loaded");
            return;
        }
        props.setTranscript((transcript: TSTranscript) => {
            return {
                ...transcript,
                segments: [],
            };
        });
        setTranscribing(true);
        console.log("Transcribing data: ", audioData);
        await session.current.transcribe(
            audioData!,
            audioMetadata!.fromMic,
            (s: any) => {
                if (s.last) {
                    setTranscribing(false);
                    props.setDownloadAvailable(true);
                    return;
                }
                props.setTranscript((transcript: TSTranscript) => {
                    return {
                        ...transcript,
                        segments: [...transcript.segments, s],
                    };
                });
            }
        );
    };

    return (
        <div className="flex-1 w-1/2 h-full flex flex-col relative z-10 overflow-hidden">
            <div className="h-full px-4 xl:pl-32 my-4">
                <img
                    src="/whisper-turbo.png"
                    className="w-full xl:w-3/4 2xl:w-1/2 mx-auto pt-8 pb-4 cursor-pointer"
                    onClick={() =>
                        window.open(
                            "https://github.com/FL33TW00D/whisper-turbo",
                            "_blank"
                        )
                    }
                />
                <div className="flex flex-col mx-auto gap-6">
                    <div>
                        <ModelSelector
                            selectedModel={selectedModel}
                            setSelectedModel={setSelectedModel}
                            loaded={loaded}
                            progress={progress}
                        />
                        <ProgressBar progress={progress} loaded={loaded} />
                        {selectedModel != loadedModel && progress == 0 && (
                            <div className="flex flex-row justify-end">
                                <button
                                    className="outline text-white text-2xl font-semibold mt-2 px-3 bg-pop-orange"
                                    onClick={loadModel}
                                >
                                    {modelLoading ? "Loading..." : "Load"}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col w-full">
                            <label className="text-white text-xl font-semibold">
                                Upload Audio
                            </label>
                            <label
                                className="bg-pop-orange text-xl outline outline-white w-full text-white font-semibold py-2.5 px-8 mx-auto cursor-pointer w-full"
                                htmlFor="audioFile"
                            >
                                <div className="flex flex-row justify-between">
                                    <span className="">
                                        {audioData && audioMetadata
                                            ? audioMetadata.file.name
                                            : `Select Audio File`}
                                    </span>
                                    <span className="my-auto">
                                        {audioData
                                            ? humanFileSize(audioData.length)
                                            : ""}
                                    </span>
                                </div>
                            </label>
                            <input
                                type="file"
                                className="hidden"
                                name="audioFile"
                                id="audioFile"
                                onChange={handleAudioFile()}
                                accept=".wav,.aac,.m4a,.mp4,.mp3"
                            />
                        </div>
                        <MicButton
                            setBlobUrl={setBlobUrl}
                            setAudioData={setAudioData}
                            setAudioMetadata={setAudioMetadata}
                        />
                    </div>
                    {blobUrl && (
                        <div>
                            <label className="text-white text-xl font-semibold">
                                Your Audio
                            </label>
                            <audio
                                controls
                                key={blobUrl}
                                className="mx-auto w-full"
                                style={{
                                    fontFamily: "__VT323_2a9463",
                                }}
                            >
                                <source
                                    key={blobUrl}
                                    src={blobUrl}
                                    type="audio/wav"
                                />
                            </audio>
                        </div>
                    )}
                </div>

                <div className="flex flex-row pt-8 gap-4 mx-auto">
                    <button
                        className="bg-pop-orange text-2xl outline outline-white text-white font-semibold py-3 px-8 mx-auto cursor-pointer active:bg-pop-orange-dark"
                        onClick={runSession}
                        disabled={transcribing}
                    >
                        {transcribing ? (
                            <div className="flex p-4">
                                <span className="loader"></span>
                            </div>
                        ) : (
                            "Transcribe"
                        )}
                    </button>
                </div>
            </div>
            <div className="absolute bottom-0 w-full text-center px-4 xl:pl-32">
                <p className="text-2xl text-white mx-auto">
                    Built by{" "}
                    <a
                        href="https://twitter.com/fleetwood___"
                        className="hover:underline hover:text-blue-600"
                    >
                        @fleetwood
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ControlPanel;
