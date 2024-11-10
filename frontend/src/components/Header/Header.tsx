export default function Header() {
    return (
        <header className="grid grid-cols-4 items-center px-12 py-8 mb-12">
            <h1 className="text-2xl text-black">MemeGen</h1>
            <nav className="col-span-2 mx-auto h-fit">
                <ul className="flex justify-center align-center gap-12">
                    <li className="inline-block">
                        <a href="/" className="text-black">Home</a>
                    </li>
                    <li className="inline-block">
                        <a href="/generator/create" className="text-black">Create</a>
                    </li>
                    <li className="inline-block">
                        <a href="/images" className="text-black">Images</a>
                    </li>
                </ul>
            </nav>
            <div className="flex justify-end items-center gap-12">
                <div className="px-4 py-2 bg-gray-200 rounded-md">
                    <span className="text-black">
                        Tokens
                        <img src="/tokens.svg" alt="Tokens SVG" className="inline-block ml-2"/>
                    </span>
                    <span className="block text-gray-500">10 left</span>
                </div>
                <a href="/profile" className="rounded-full bg-gray-200 w-10 h-10 text-center">
                    {/*<img src="" alt="GU"/>*/}
                    <span className="text-black mt-2 inline-block">GU</span>
                </a>
            </div>
        </header>
    );
};
