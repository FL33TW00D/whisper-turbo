import type { NextPage } from "next";
import { Open_Sans } from "@next/font/google";
import { useState, useRef, useEffect } from "react";
import { InferenceSession, SessionManager } from "whisper-turbo";

const open_sans = Open_Sans({ subsets: ["latin"] });

const Home: NextPage = () => {
    const [text, setText] = useState("");
    const session = useRef<InferenceSession | null>(null);
    const [modelFile, setModelFile] = useState<ArrayBuffer | null>(null);
    const [tokenizerFile, setTokenizerFile] = useState<ArrayBuffer | null>(
        null
    );
    const [audioFile, setAudioFile] = useState<ArrayBuffer | null>(null);

    const loadModel = async () => {
        if (session.current) {
            session.current.destroy();
        }
        const manager = new SessionManager();
        const loadResult = await manager.loadModel(
            modelFile as Uint8Array,
            tokenizerFile as Uint8Array,
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
                        <input type="file" name="modelFile" id="modelFile" />
                        <label htmlFor="tokenizerFile">Tokenizer File</label>
                        <input
                            type="file"
                            name="tokenizerFile"
                            id="tokenizerFile"
                        />
                        <label htmlFor="audioFile">Audio File</label>
                        <input type="file" name="audioFile" id="audioFile" />
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
