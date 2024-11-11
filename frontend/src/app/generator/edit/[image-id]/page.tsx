"use client";

import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";
import {useState, useRef, useEffect, ChangeEvent} from "react";
import {useSearchParams} from "next/navigation";
import {TextBox} from "@/types/generator";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Trash2} from "lucide-react";

const schema = z.object({
    "meme-text": z.string().min(1, {message: "Text must be at least 1 character"}),
    "select-font": z.string().min(1, {message: "Font must be selected"}),
    "toggle-white-box": z.boolean(),
    "toggle-sidebars": z.boolean(),
});

const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;

export default function GeneratorEditPage() {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [selectedTextBox, setSelectedTextBox] = useState<number | null>(null);
    const [textBoxes, setTextBoxes] = useState<Array<TextBox>>([]);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            "meme-text": "",
            "select-font": "arial",
            "toggle-white-box": false,
            "toggle-sidebars": false
        }
    });

    useEffect(() => {
        // Render canvas when text boxes change
        renderCanvas();
    }, [textBoxes])

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        // Cleanup
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    }, [isDragging, selectedTextBox]);

    // TODO: Check if there is method to store image locally (e.g. in React Context, Cache) to reduce the number of requests to the server
    const searchParams = useSearchParams();
    const imageId = searchParams.get('imageId');

    /**
     * */
    function addTextBox() {
        const data = form.getValues();
        const newTextBox: TextBox = {
            text: data['meme-text'],
            font: data['select-font'],
            whiteBox: data['toggle-white-box'],
            sidebars: data['toggle-sidebars'],
            // Default position when adding a new text box
            position: {x: 50, y: 50,}
        }

        setTextBoxes([...textBoxes, newTextBox]);
    }

    function removeTextBox(index: number) {
        setTextBoxes(prev => prev.filter((_, i) => i !== index));
    }

    /**
     * */
    function renderCanvas() {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const image = new Image();
        image.src = process.env.NODE_ENV === 'development' ?
            '/images/placeholder-meme.png' :
            `/api/images/${imageId}`;

        // Set image dimensions for development environment (until generator is working)
        image.onload = () => {
            canvas.width = CANVAS_WIDTH;
            canvas.height = CANVAS_HEIGHT;

            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            textBoxes.forEach(textBox => {
                if (textBox.whiteBox) {
                    ctx.fillStyle = 'white';
                    // ctx.fillRect(0, 0, canvas.width * 2, 50);
                    ctx.fillRect(textBox.position.x - canvas.width, textBox.position.y - 25, canvas.width * 2, 30);
                }

                ctx.font = `20px ${textBox.font || "Arial"}`;
                ctx.fillStyle = 'black';
                ctx.fillText(textBox.text, textBox.position.x, textBox.position.y);
            });
        }
    }

    /**
     * */
    function handleMouseDown(index: number, e: React.MouseEvent<HTMLDivElement>) {
        setSelectedTextBox(index);
        setIsDragging(true);
    }

    /**
     * */
    function handleMouseMove(e: MouseEvent) {
        if (isDragging && selectedTextBox !== null) {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setTextBoxes((prevTextBoxes) =>
                prevTextBoxes.map((textBox, index) =>
                    index === selectedTextBox ? {...textBox, position: {x, y}} : textBox
                )
            );
        }
    }

    /**
     * */
    function handleMouseUp() {
        setIsDragging(false);
        setSelectedTextBox(null);
    }

    /**
     * */
    function downloadMeme() {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement("a");
        link.download = "meme.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }

    return (
        <section id="create-page" className="max-w-screen-xl mx-auto relative">
            <h1 className="text-center text-lg">Edit your creation</h1>
            <aside className="bg-white rounded-lg p-6 w-80 flex flex-col gap-6 absolute left-0 top-12 shadow-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(addTextBox)} className="flex flex-col gap-6">
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
                                    <Select onValueChange={(value: string) => console.log("New value:", value)}>
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
                        <Button type="submit" className="px-4">Add</Button>
                    </form>
                </Form>
            </aside>
            <div className={`w-[${CANVAS_WIDTH}px] h-[${CANVAS_HEIGHT}px] mx-auto my-6`}>
                <canvas ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        className="shadow-gray-400 shadow-lg"
                />
            </div>
            <div className="w-fit mx-auto flex gap-6">
                <Button type="button" onClick={downloadMeme} className="px-4 w-24 bg-gray-900">Download</Button>
                <Button type="button" className="px-4 w-24 bg-gray-700">Save</Button>
            </div>
            <aside
                className={`bg-white rounded-lg p-6 w-80 flex flex-col gap-6 absolute right-0 top-12 shadow-lg max-h-[${CANVAS_HEIGHT}px] overflow-auto`}>
                <h2 className="text-xl">Text boxes</h2>
                <ul className="flex flex-col gap-4">
                    {textBoxes.length === 0 ?
                        <h4 className="text-gray-700">No text boxes in the image yet</h4> :
                        textBoxes.map((textBox, index) => (
                            <li key={index}>
                                <div className="grid grid-cols-4 items-center gap-4 bg-gray-200 rounded-lg p-4"
                                     onClick={e => handleMouseDown(index, e)}>
                                    <span className="col-span-3 break-words overflow-ellipsis">{textBox.text}</span>
                                    <Button className="bg-red-400 w-fit" onClick={() => removeTextBox(index)}>
                                        <Trash2/>
                                    </Button>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </aside>
        </section>
    );
};
