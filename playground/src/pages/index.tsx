import type { NextPage } from "next";
import { VT323 } from "@next/font/google";
import { useState } from "react";
import Layout from "../components/layout";
import WebGPUModal from "../components/modal";
import { Segment } from "whisper-turbo";
import ControlPanel, { Transcript } from "../components/controlPanel";

const vt = VT323({ weight: "400", display: "swap" });

const Home: NextPage = () => {
    const [transcript, setTranscript] = useState<Transcript>({
        segments: [],
    });
    const [downloadAvailable, setDownloadAvailable] = useState(false);

    const handleDownload = () => {
        const jsonData = JSON.stringify(transcript);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.download = "transcript.json";
        link.href = url;

        link.click();
        link.remove();
    };

    return (
        <Layout title={"Whisper Turbo"}>
            <div className={`p-0 ${vt.className}`}>
                <div className="flex gap-8 flex-row h-screen">
                    <ControlPanel
                        transcript={transcript!}
                        setTranscript={setTranscript}
                        setDownloadAvailable={setDownloadAvailable}
                    />
                    <div className="flex-1 w-1/2 h-full flex flex-col relative z-10">
                        <div className="h-full flex flex-col mx-auto px-4 xl:pr-32 overflow-scroll py-12 w-full">
                            <div className="flex flex-col h-full">
                                {transcript &&
                                    transcript.segments.map(
                                        (segment: Segment) => {
                                            return (
                                                <div
                                                    key={segment.start}
                                                    className="flex w-full py-4"
                                                >
                                                    <div
                                                        className={`rounded p-4 bg-white outline outline-2 outline-black shadow-lg align-right`}
                                                    >
                                                        <div className="font-bold text-lg text-green-700 mb-2">
                                                            {segment.start}
                                                        </div>
                                                        <div className="mb-2 text-2xl text-slate-900 text-right">
                                                            {segment.text}
                                                        </div>
                                                        <div className="font-bold text-lg text-red-700">
                                                            {segment.stop}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                {downloadAvailable ? (
                                    <div className="flex flex-row justify-end py-4">
                                        <button
                                            className="bg-green-500 outline hover:bg-green-700 text-white font-bold py-2 px-4"
                                            onClick={handleDownload}
                                        >
                                            Download
                                        </button>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <WebGPUModal />
        </Layout>
    );
};

export default Home;
