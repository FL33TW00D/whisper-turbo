import type { NextPage } from "next";
import { VT323 } from "@next/font/google";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import ControlPanel from "../components/controlPanel";
import { Transcript } from "whisper-webgpu";

const vt = VT323({ weight: "400", display: "swap" });

interface TranscriptionSnippet {
    text: string;
    start?: number;
    end?: number;
}

const Home: NextPage = () => {
    const [transcript, setTranscript] = useState<Transcript | null>(null);

    useEffect(() => {
        console.log(transcript);
    }, [transcript]);

    return (
        <Layout title={"Whisper Turbo"}>
            <div className={`p-0 ${vt.className}`}>
                <div className="flex gap-8 flex-row h-screen">
                    <ControlPanel setTranscript={setTranscript} />
                    <div className="flex-1 w-1/2 h-full flex flex-col relative z-10">
                        <div className="h-full flex flex-col mx-auto px-4 xl:pr-32 overflow-scroll py-12 w-full">
                            <div className="flex flex-col h-full">
                                {transcript && transcript.segments && transcript.segments!.map(
                                    (snippet: TranscriptionSnippet) => {
                                        return (
                                            <div
                                                key={snippet.start}
                                                className="flex w-full py-4"
                                            >
                                                <div
                                                    className={`rounded p-4 bg-white outline outline-2 outline-black shadow-lg align-right`}
                                                >
                                                    <div className="font-bold text-lg text-green-700 mb-2">
                                                        {snippet.start}
                                                    </div>
                                                    <div className="mb-2 text-2xl text-slate-900 text-right">
                                                        {snippet.text}
                                                    </div>
                                                    <div className="font-bold text-lg text-red-700">
                                                        {snippet.end}
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
        </Layout>
    );
};

export default Home;
