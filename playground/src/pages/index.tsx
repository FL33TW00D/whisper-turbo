import type { NextPage } from "next";
import { Inter, VT323 } from "@next/font/google";
import { useState, useRef, useEffect } from "react";
import {
    AvailableModels,
    InferenceSession,
    SessionManager,
} from "whisper-turbo";
import Layout from "../components/layout";
import toast from "react-hot-toast";

const open_sans = Inter({ subsets: ["latin"] });
const vt = VT323({ weight: "400", display: "swap" });

const Home: NextPage = () => {
    const [text, setText] = useState("");
    const session = useRef<InferenceSession | null>(null);
    const [selectedModel, setSelectedModel] = useState<AvailableModels>(
        AvailableModels.WHISPER_TINY
    );
    const [audioFile, setAudioFile] = useState<Uint8Array | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

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
        if (!selectedModel) {
            console.error("No model loaded");
            return;
        }
        const manager = new SessionManager();
        const loadResult = await manager.loadModel(selectedModel, () =>
            setLoaded(true)
        );
        if (loadResult.isErr) {
            toast.error(loadResult.error.message);
        } else {
            session.current = loadResult.value;
        }
    };

    const runSession = async () => {
        if (!session.current) {
            toast.error("No model loaded");
            return;
        }
        await session.current.stream(audioFile!, (decoded: string) => {
            setText(decoded);
        });
    };

    const fmtModel = (model: AvailableModels) => {
        let name = model.split("-")[1];
        name = name.charAt(0).toUpperCase() + name.slice(1);
        return name;
    };

    return (
        <Layout title={"Whisper Turbo"}>
            <div className={`p-0 ${vt.className}`}>
                <div className="flex-1 flex flex-col relative z-10 overflow-scroll">
                    <div className="flex flex-row h-screen">
                        <div className="flex flex-col p-12 w-full mx-auto">
                            <img
                                src="/whisper-turbo.png"
                                className="w-1/2 xl:w-1/3 mx-auto pb-8 cursor-pointer"
                                onClick={() =>
                                    window.open(
                                        "https://github.com/FL33TW00D/whisper-turbo",
                                        "_blank"
                                    )
                                }
                            />
                            <div className="flex flex-row mx-auto">
                                <div className="p-20">
                                    <div className="group inline-block relative">
                                        <button className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
                                            <span className="mr-1">
                                                Dropdown
                                            </span>
                                            <svg
                                                className="fill-current h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </button>
                                        <ul className="absolute hidden text-gray-700 pt-1 group-hover:block">
                                            <li className="">
                                                {Object.values(
                                                    AvailableModels
                                                ).map((model) => (
                                                    <a
                                                        className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                                                        href="#"
                                                    >
                                                        {fmtModel(model)}
                                                    </a>
                                                ))}
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <label
                                    className="bg-pop-orange text-xl border-4 text-white font-semibold py-3 px-6 rounded-lg mx-auto cursor-pointer"
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
                                            key={blobUrl}
                                            src={blobUrl}
                                            type="audio/wav"
                                        />
                                    </audio>
                                </div>
                            )}
                            <div className="flex flex-row pt-8 gap-4 mx-auto">
                                <button
                                    className="bg-pop-orange text-xl border-4 text-white font-semibold py-3 px-6 rounded-lg mx-auto cursor-pointer"
                                    onClick={loadModel}
                                >
                                    Load Model
                                </button>
                                <button
                                    className="bg-pop-orange text-xl border-4 text-white font-semibold py-3 px-6 rounded-lg mx-auto cursor-pointer"
                                    onClick={runSession}
                                >
                                    Process Files
                                </button>
                            </div>
                            <div className="flex flex-row pt-8 pb-24 gap-4 mx-auto w-3/4 xl:w-1/2">
                                <p
                                    className={`text-2xl text-white font-bold ${vt.className}`}
                                >
                                    {text}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer w-full text-2xl text-center mt-10 pt-3 text-white">
                    <h5>
                        Created by{" "}
                        <a
                            href="https://twitter.com/fleetwood___"
                            className="underline hover:text-pop-orange
                            transition duration-100 ease-in-out"
                        >
                            @fleetwood
                        </a>
                    </h5>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
