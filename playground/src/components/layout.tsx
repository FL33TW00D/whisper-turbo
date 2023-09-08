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
        <div className="flex min-h-screen flex-col justify-center bg-stone-50">
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
