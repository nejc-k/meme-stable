"use client";

import styles from "./page.module.css";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {redirect} from "next/navigation";

interface Image {
    id: string;
    url: string;
    name: string;
}

const imagesPlaceholders: Array<Image> = [
    {id: "1", url: "https://via.placeholder.com/512", name: "Image 1"},
    {id: "2", url: "/images/placeholder-meme.png", name: "Image 1"},
    {id: "3", url: "https://via.placeholder.com/512", name: "Image 1"},
    {id: "4", url: "/images/placeholder-meme.png", name: "Image 1"},
    {id: "5", url: "https://via.placeholder.com/512", name: "Image 1"},
    {id: "6", url: "/images/placeholder-meme.png", name: "Image 1"},
]

export default function ImagesPage() {
    const [images, setImages] = useState<Array<Image>>(imagesPlaceholders);

    useEffect(() => {
        // TODO: Fetch images from api
    }, []);

    /**
     * Handles the download of the meme image
     * */
    function handleDownload(e: React.MouseEvent<HTMLButtonElement>) {
        const imageElement = (e.target as HTMLElement).closest('div')?.previousElementSibling as HTMLImageElement;
        if (imageElement) {
            document.body.style.cursor = 'wait';
            const link = document.createElement('a');
            link.href = imageElement.src;
            link.download = imageElement.alt || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            document.body.style.cursor = 'auto';
        } else {
            console.warn('Image element not found');
        }
    }

    /**
     * Redirects to the edit page with selected meme image
     * */
    function handleEdit(e: React.MouseEvent<HTMLButtonElement>) {
        const imageElement = (e.target as HTMLElement).closest('div')?.previousElementSibling as HTMLImageElement;
        redirect('/generator/edit/' + imageElement.dataset.imageId);
    }

    return (
        <section className="max-w-screen-xl mx-auto">
            <h1 className="text-center text-2xl">Meme galery</h1>
            <span className="block text-center text-gray-700 mt-6">
                Disclaimer: Be aware that all created memes are stored for a limited time. Download or share them before they are removed.
            </span>
            <div className="mt-12 bg-white rounded-xl shadow-lg">
                {images.length === 0 ?
                    <span className="block col-span-3 text-center text-gray-700 py-6">
                        Gallery is currently empty
                    </span> :
                    <div className="grid grid-cols-3 gap-6 p-6">
                        {images.map((image) => (
                            <div key={image.id}
                                 className={styles['gallery-meme-container'].concat(" aspect-square w-full rounded-lg overflow-hidden hover:-translate-y-6 hover:shadow-lg hover:scale-105 transition-all shadow-lg relative")}
                            >
                                <img src={image.url} alt={image.name} data-image-id={image.id}
                                     className="object-cover w-full h-full"/>
                                <div
                                    className="absolute left-o top-0 w-full h-full flex flex-col justify-center items-center gap-6">
                                    <Button onClick={handleDownload} className="w-24 hidden transition-all">
                                        Download
                                    </Button>
                                    <Button onClick={handleEdit} className="w-24 bg-gray-700 hidden transition-all">
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </section>
    );
};