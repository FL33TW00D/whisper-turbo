import type { NextPage } from "next";
import { Inter } from "@next/font/google";
import { useState, useRef, useEffect } from "react";
import { InferenceSession, SessionManager } from "whisper-turbo";
import Layout from "../components/layout";

const open_sans = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
    const [text, setText] = useState("");
    const session = useRef<InferenceSession | null>(null);
    const [modelFile, setModelFile] = useState<Uint8Array | null>(null);
    const [tokenizerFile, setTokenizerFile] = useState<Uint8Array | null>(null);
    const [audioFile, setAudioFile] = useState<Uint8Array | null>(null);

    const handleFileChange = (setFileState: any) => async (event: any) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            setFileState(uint8Array);
        };
        reader.readAsArrayBuffer(file);
    };

    // Somewhere in the state of your component...
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    // When the audio file is uploaded, create a new Blob URL
    useEffect(() => {
        if (audioFile) {
            const blob = new Blob([audioFile], { type: "audio/wav" }); // set type to audio type of your data
            const url = URL.createObjectURL(blob);
            setBlobUrl(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [audioFile]);

    const loadModel = async () => {
        if (session.current) {
            session.current.destroy();
        }
        if (!modelFile || !tokenizerFile) {
            console.error("No model or tokenizer file loaded");
            return;
        }
        const manager = new SessionManager();
        const loadResult = await manager.loadModel(
            modelFile,
            tokenizerFile,
            () => console.log("Progress")
        );
        if (loadResult.isErr) {
            console.error(loadResult.error);
        } else {
            session.current = loadResult.value;
        }
    };

    const runSession = async () => {
        if (!session.current) {
            console.error("No session loaded");
            return;
        }
        const inferenceResult = await session.current.run(audioFile!);
        console.log(inferenceResult);
        inferenceResult.repr[0] == "Ok"
            ? setText(inferenceResult.repr[1])
            : console.error(inferenceResult);
    };

    return (
        <Layout title={"Whisper Turbo"}>
            <div className={`p-0 ${open_sans.className}`}>
                <div className="flex-1 flex flex-col relative z-10">
                    <div className="flex flex-row h-screen">
                        <div className="flex flex-col p-12 w-full mx-auto">
                            <img
                                src="/whisper-turbo.png"
                                className="w-1/2 mx-auto pb-8"
                            />
                            <div className="flex flex-row mx-auto">
                                <label
                                    className="bg-pop-orange border-y-4 border-l-4 text-white font-semibold py-4 px-8 rounded-l-lg mx-auto cursor-pointer"
                                    htmlFor="modelFile"
                                >
                                    Model File
                                </label>
                                <input
                                    type="file"
                                    className="hidden"
                                    name="modelFile"
                                    id="modelFile"
                                    onChange={handleFileChange(setModelFile)}
                                />
                                <label
                                    className="bg-pop-orange border-y-4 text-white font-semibold py-4 px-8 mx-auto cursor-pointer"
                                    htmlFor="tokenizerFile"
                                >
                                    Tokenizer File
                                </label>
                                <input
                                    type="file"
                                    className="hidden"
                                    name="tokenizerFile"
                                    id="tokenizerFile"
                                    onChange={handleFileChange(
                                        setTokenizerFile
                                    )}
                                />
                                <label
                                    className="bg-pop-orange border-y-4 border-r-4 text-white font-semibold py-4 px-8 rounded-r-lg mx-auto cursor-pointer"
                                    htmlFor="audioFile"
                                >
                                    Audio File
                                </label>
                                <input
                                    type="file"
                                    className="hidden"
                                    name="audioFile"
                                    id="audioFile"
                                    onChange={handleFileChange(setAudioFile)}
                                />
                            </div>

                            {blobUrl && (
                                <div className="flex flex-row mx-auto mt-8">
                                    <audio controls>
                                        <source
                                            src={blobUrl}
                                            type="audio/wav"
                                        />
                                    </audio>
                                </div>
                            )}
                            <div className="flex flex-row pt-16 gap-4 mx-auto">
                                <button
                                    className="bg-pop-orange border-2 text-white font-semibold py-4 px-8 rounded-lg mx-auto cursor-pointer"
                                    onClick={loadModel}
                                >
                                    Load Model
                                </button>
                                <button
                                    className="bg-pop-orange border-2 text-white font-semibold py-4 px-8 rounded-lg mx-auto cursor-pointer"
                                    onClick={runSession}
                                >
                                    Process Files
                                </button>
                            </div>
                            <div className="flex flex-row py-8 gap-4 mx-auto w-1/2">
                                <p className="text-lg text-white font-bold">{text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
