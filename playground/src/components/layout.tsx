import Head from "next/head";
import { Toaster } from "react-hot-toast";
import React from "react";

export const siteTitle = "AI Playground";

type LayoutProps = {
    children: React.ReactNode;
    title: string;
};

export default function Layout(props: LayoutProps) {
    return (
        <div
            className="flex h-full min-h-screen bg-sky-500 -z-20"
            style={{
                backgroundColor: "#38bdf8",
                backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='30' height='30' opacity='0.4' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10h10v10H0V10zM10 0h10v10H10V0z' fill='%23bae6fd' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")",
            }}
        >
            <Head>
                <title>{props.title}</title>
                <meta property="og:title" content={props.title} />
            </Head>
            <main className="flex flex-1 flex-col">
                <Toaster />
                <div className="flex-1">{props.children}</div>
            </main>
        </div>
    );
}
