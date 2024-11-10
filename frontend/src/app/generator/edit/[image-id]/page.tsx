"use client";

import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";
import {useState} from "react";
import {useSearchParams} from "next/navigation";

interface TextBox {
    text: string;
    font: string;
    whiteBox: boolean;
    sidebars: boolean;
    position: {
        x: number;
        y: number;
    }
}

export default function GeneratorEditPage() {
    const [textBoxes, setTextBoxes] = useState<Array<TextBox>>([]);
    const form = useForm({});

    // TODO: Check if there is method to store image locally (e.g. in React Context, Cache) to reduce the number of requests to the server
    const searchParams = useSearchParams();
    const imageId = searchParams.get('imageId');

    return (
        <section id="create-page" className="max-w-screen-xl mx-auto relative">
            <h1 className="text-center text-lg">Edit your creation</h1>
            <aside className="bg-white rounded-lg p-6 w-80 flex flex-col gap-6 absolute left-0 top-12 shadow-lg">
                <Form {...form}>
                    <FormField name="meme-text" render={({field}) => (
                        <FormItem>
                            <FormLabel>Add text</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}/>
                    <FormField name="select-font" render={({field}) => (
                        <FormItem>
                            <FormLabel>Font</FormLabel>
                            <FormControl>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Font"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="arial">Arial</SelectItem>
                                        <SelectItem value="times">Times</SelectItem>
                                        <SelectItem value="courier">Courier</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}/>
                    <FormField name="toggle-white-box" render={({field}) => (
                        <FormItem className="flex items-center gap-4">
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel>White box</FormLabel>
                        </FormItem>
                    )}/>
                    <FormField name="toggle-sidebars" render={({field}) => (
                        <FormItem className="flex items-center gap-4">
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel>Sidebars</FormLabel>
                        </FormItem>
                    )}/>
                    <Button type="button" className="px-4">Add</Button>
                </Form>
            </aside>
            <div className="w-[512px] h-[512px] mx-auto mt-6">
                <img src="/images/placeholder-meme.png" alt="Meme preview" className="shadow-gray-400 shadow-lg"/>
            </div>
            <div className="w-fit mx-auto flex gap-6">
                <Button type="button" className="px-4 w-24 bg-gray-900">Download</Button>
                <Button type="button" className="px-4 w-24 bg-gray-700">Share</Button>
            </div>
            <aside className="bg-white rounded-lg p-6 w-80 flex flex-col gap-6 absolute right-0 top-12 shadow-lg">
                <h2>Texts</h2>
                <ul>
                    {textBoxes.length === 0 ?
                        <h4 className="text-gray-700">No text boxes in the image yet</h4> :
                        textBoxes.map((textBox, index) => (
                            <li key={index}>
                                <div className="flex items-center gap-4">
                                    <span>{textBox.text}</span>
                                    <button>Delete</button>
                                </div>
                            </li>
                        ))}
                </ul>
            </aside>
        </section>
    );
};
