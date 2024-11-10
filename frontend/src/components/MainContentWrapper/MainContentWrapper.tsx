import Header from "@/components/Header/Header";
import React from "react";
import Footer from "@/components/Footer/Footer";

interface MainContentWrapperProps {
    children: React.ReactNode;
}

export default function MainContentWrapper({children}: MainContentWrapperProps) {
    return (
        <>
            <Header/>
            {/*<main className="max-w-screen-lg bg-red-600">*/}
            <main className="">
                {children}
            </main>
            <Footer/>
        </>
    );
};
