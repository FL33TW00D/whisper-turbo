import type { NextPage } from "next";
import { Open_Sans } from "@next/font/google";
import { useState } from "react";
import React from "react";


const open_sans = Open_Sans({ subsets: ["latin"] });

const Home: NextPage = () => {
    const [text, setText] = useState("");
    const session = useRef<InferenceSession | null>(null);

    const handleButtonClick = () => {
        // Place your JavaScript code here.
        setText("Processed Text Here");
    };
    return (
        <div className={`p-0 ${open_sans.className}`}>
            <div className="flex-1 flex flex-col">
                <div className="flex flex-row h-screen">
                    <h1>HELLO WORLD</h1>
                    <input
                        type="file"
                        name="modelFile"
                        id="modelFile"
                        accept=".model"
                    />
                    <input
                        type="file"
                        name="audioFile"
                        id="audioFile"
                        accept=".audio"
                    />
                    <button onClick={handleButtonClick}>Process Files</button>
                    <div>{text}</div>
                </div>
            </div>
        </div>
    );
};

export default Home;
