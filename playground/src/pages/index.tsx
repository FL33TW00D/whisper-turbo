import type { NextPage } from "next";
import { Open_Sans } from "@next/font/google";
import { useState, useRef, useEffect } from "react";
import { InferenceSession, SessionManager } from "whisper-turbo";

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
        const inferenceResult = await session.current.run(
            audioFile as Float64Array
        );
        console.log(inferenceResult);
    };

    return (
        <div className={`p-0 ${open_sans.className}`}>
            <div className="flex-1 flex flex-col">
                <div className="flex flex-row h-screen">
                    <h1>HELLO WORLD</h1>
                    <div className="flex flex-col py-16">
                        <label htmlFor="modelFile">Model File</label>
                        <input
                            type="file"
                            name="modelFile"
                            id="modelFile"
                            onChange={handleFileChange(setModelFile)}
                        />
                        <label htmlFor="tokenizerFile">Tokenizer File</label>
                        <input
                            type="file"
                            name="tokenizerFile"
                            id="tokenizerFile"
                            onChange={handleFileChange(setTokenizerFile)}
                        />
                        <label htmlFor="audioFile">Audio File</label>
                        <input
                            type="file"
                            name="audioFile"
                            id="audioFile"
                            onChange={handleFileChange(setAudioFile)}
                        />
                    </div>
                    <div className="flex flex-col py-16">
                        <button onClick={loadModel}>Load Model</button>
                        <button onClick={runSession}>Process Files</button>
                    </div>
                    <div>{text}</div>
                </div>
            </div>
        </div>
    );
};

export default Home;
