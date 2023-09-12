import type { NextPage } from "next";
import { VT323 } from "@next/font/google";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import ControlPanel from "../components/controlPanel";

const vt = VT323({ weight: "400", display: "swap" });

interface TranscriptionSnippet {
    text: string;
    start?: number;
    end?: number;
}

const Home: NextPage = () => {
    const [text, setText] = useState<string>("");
    const [snippets, setSnippets] = useState<TranscriptionSnippet[]>([]);

    useEffect(() => {
        let delimiter = new RegExp("<|d+.d{2}|>");
        let chunks = text.split(delimiter).filter((chunk) => chunk !== "");
        if (chunks.length == 0) {
            return;
        }

        let snippets: TranscriptionSnippet[] = [];
        for (let i = 0; i < chunks.length; i += 3) {
            let start = chunks[i];
            let text = chunks[i + 1];
            let end = chunks[i + 2];

            if (start !== undefined) {
                start = start.replace(/\|/g, "");
            }
            if (end !== undefined) {
                end = end.replace(/\|/g, "");
            }

            snippets.push({
                start: start ? parseFloat(start) : undefined,
                text: text,
                end: end ? parseFloat(end) : undefined,
            });
        }
        setSnippets(snippets);
    }, [text]);

    return (
        <Layout title={"Whisper Turbo"}>
            <div className={`p-0 ${vt.className}`}>
                <div className="flex gap-8 flex-row h-screen">
                    <ControlPanel setText={setText} />
                    <div className="flex-1 w-1/2 h-full flex flex-col relative z-10">
                        <div className="h-full flex flex-col mx-auto px-4 xl:pr-32 overflow-scroll py-12 w-full">
                            <div className="flex flex-col h-full">
                                {snippets.map(
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
