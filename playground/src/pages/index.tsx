import type { NextPage } from "next";
import { VT323 } from "@next/font/google";
import { useState } from "react";
import Layout from "../components/layout";
import ControlPanel, {
    TSSegment,
    TSTranscript,
} from "../components/controlPanel";
import WebGPUModal from "../components/modal";

const vt = VT323({ weight: "400", display: "swap" });

const Home: NextPage = () => {
    const [transcript, setTranscript] = useState<TSTranscript>({
        segments: [],
    });

    return (
        <Layout title={"Whisper Turbo"}>
            <div className={`p-0 ${vt.className}`}>
                <div className="flex gap-8 flex-row h-screen">
                    <ControlPanel
                        transcript={transcript!}
                        setTranscript={setTranscript}
                    />
                    <div className="flex-1 w-1/2 h-full flex flex-col relative z-10">
                        <div className="h-full flex flex-col mx-auto px-4 xl:pr-32 overflow-scroll py-12 w-full">
                            <div className="flex flex-col h-full">
                                {transcript &&
                                    transcript.segments.map(
                                        (segment: TSSegment) => {
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
