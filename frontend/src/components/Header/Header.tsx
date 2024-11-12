"use client";

import {useAuth} from "@/context/AuthContext";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
    const {user} = useAuth();

    return (
        <header className="grid grid-cols-4 items-center px-12 py-8 mb-12">
            <h1 className="text-2xl text-black">MemeGen</h1>
            <nav className="col-span-2 mx-auto h-fit">
                <ul className="flex justify-center align-center gap-16 text-xl">
                    <li className="inline-block">
                        <Link href="/" className="text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-all">
                            Home
                        </Link>
                    </li>
                    <li className="inline-block">
                        <Link href="/generator/create"
                              className="text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-all">
                            Create
                        </Link>
                    </li>
                    <li className="inline-block">
                        <Link href="/images"
                              className="text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-all">
                            Images
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="flex justify-end items-center gap-12">
                {user ? (
                    <>
                        <div className="px-4 py-2 bg-gray-200 rounded-md">
                            <span className="text-black">
                                Tokens
                                <img src="/tokens.svg" alt="Tokens SVG" className="inline-block ml-2"/>
                            </span>
                            <span className="block text-gray-500">{user.credits} left</span>
                        </div>
                        <Link href="/profile"
                              className="rounded-full bg-gray-200 w-12 h-12 text-center hover:bg-gray-500 hover:scale-125 transition-all">
                            <span className="text-black mt-3 inline-block text-xl">
                                {user.name.charAt(0).toUpperCase()}
                                {user.lastname.charAt(0).toUpperCase()}
                            </span>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/login">
                            <Button className="bg-gray-700">Login</Button>
                        </Link>
                        <Link href="/register">
                            <Button className="bg-gray-900">Sign up</Button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};
