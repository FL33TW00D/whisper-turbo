import type { NextPage } from "next";
import { Open_Sans } from "@next/font/google";
import { useState, useRef } from "react";
import { InferenceSession, SessionManager } from "whisper-turbo";
import Layout from "../components/layout";

const open_sans = Open_Sans({ subsets: ["latin"] });

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
        //read the file to Uint8Array and call setFileState
    };

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
                <div className="flex-1 flex flex-col">
                    <div className="flex flex-row h-screen">
                        <div className="flex flex-col p-12 w-full mx-auto">
                                <h1 className="mx-auto text-6xl font-semibold"> Whisper Turbo </h1>
                            <div className="flex flex-row mx-auto my-16">
                                <label
                                    className="bg-rose-400 text-white font-semibold py-2 px-4 h-12 rounded mx-auto cursor-pointer"
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
                                    className="bg-rose-400 text-white font-semibold py-2 px-4 h-12 rounded mx-auto cursor-pointer"
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
                                    className="bg-rose-400 text-white font-semibold py-2 px-4 h-12 rounded mx-auto cursor-pointer"
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
                            <div className="flex flex-row py-16 gap-4 mx-auto">
                                <button
                                    className="bg-rose-400 text-white font-semibold py-2 px-4 h-12 rounded"
                                    onClick={loadModel}
                                >
                                    Load Model
                                </button>
                                <button
                                    className="bg-rose-400 text-white font-semibold py-2 px-4 h-12 rounded"
                                    onClick={runSession}
                                >
                                    Process Files
                                </button>
                            </div>
                            <div className="flex flex-row py-16 gap-4 mx-auto w-1/2">
                                <p>{text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
