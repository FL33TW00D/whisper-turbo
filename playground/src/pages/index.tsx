import type { NextPage } from "next";
import { VT323 } from "@next/font/google";
import { useState } from "react";
import Layout from "../components/layout";
import ControlPanel from "../components/controlPanel";

const vt = VT323({ weight: "400", display: "swap" });

const Home: NextPage = () => {
    const [text, setText] = useState("");

    return (
        <Layout title={"Whisper Turbo"}>
            <div className={`p-0 ${vt.className}`}>
                <div className="flex gap-8 flex-row h-screen">
                    <ControlPanel setText={setText} />
                    <div className="flex-1 w-1/2 h-full flex flex-col relative z-10 overflow-scroll pt-16">
                        <div className="h-full flex flex-row mx-auto px-4 xl:px-16 my-4">
                            <p
                                className={`text-2xl text-white font-extrabold ${vt.className}`}
                            >
                                {text}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
