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
import {
    AlignCenter,
    AlignCenterHorizontal,
    AlignEndHorizontal,
    AlignLeft,
    AlignRight,
    AlignStartHorizontal,
    Trash2
} from "lucide-react";

const schema = z.object({
    "meme-text": z.string().min(1, {message: "Text must be at least 1 character"}),
    "select-font": z.string().min(1, {message: "Font must be selected"}),
    "font-size": z.string().min(1, {message: "Smallest font size is 1"}).max(72, {message: "Largest font size is 72"}),
    "font-color": z.string(),
    "toggle-white-box": z.boolean(),
    "white-box-padding": z.string().min(0, {message: "Smallest padding is 0"}).max(50, {message: "Largest padding is 50"}).optional(),
    "toggle-sidebars": z.boolean(),
    "sidebars-width": z.string().min(0, {message: "Smallest width is 0"}).max(256, {message: "Largest width is 256"}).optional(),
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
            "select-font": "",
            "font-size": "20",
            "font-color": "#000000",
            "toggle-white-box": false,
            "white-box-padding": "10",
            "toggle-sidebars": false,
            "sidebars-width": "50"
        }
    });

    useEffect(() => {
        renderCanvas();
    }, [textBoxes, selectedTextBox]);

    useEffect(() => {
        // Additional re-render to remove the red border around the text box
        if (!isDragging)
            renderCanvas();
    }, [isDragging]);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, selectedTextBox]);

    // TODO: Check if there is method to store image locally (e.g. in React Context, Cache) to reduce the number of requests to the server
    const searchParams = useSearchParams();
    const imageId = searchParams.get('imageId');
    const imageSrc = process.env.NODE_ENV === 'development' ?
        '/images/placeholder-meme.png' :
        `/api/images/${imageId}`

    /**
     * @description Adds a new text box to the canvas
     * @returns void
     * */
    function addTextBox() {
        console.log("Adding text box");
        const data = form.getValues();
        const newTextBox: TextBox = {
            text: data['meme-text'],
            font: data['select-font'],
            fontSize: parseInt(data['font-size']),
            fontColor: data['font-color'],
            whiteBox: data['toggle-white-box'],
            whiteBoxPadding: parseInt(data['white-box-padding']),
            sidebars: data['toggle-sidebars'],
            sidebarWidth: parseInt(data['sidebars-width']),
            // Default position when adding a new text box
            position: {x: 50, y: 50,}
        }

        setTextBoxes([...textBoxes, newTextBox]);
    }

    /**
     * @description Removes a text box from the canvas
     * @param {number} index - Index of the text box to remove
     * @returns void
     * */
    function removeTextBox(index: number) {
        setTextBoxes(prev => prev.filter((_, i) => i !== index));
    }

    /**
     * @description Renders the canvas with the image and text boxes
     * @returns void
     * */
    function renderCanvas() {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            canvas.width = CANVAS_WIDTH;
            canvas.height = CANVAS_HEIGHT;

            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            textBoxes.map((textBox, index) => {
                if (selectedTextBox !== null && index === selectedTextBox && !textBox.whiteBox) {
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(
                        textBox.position.x - 5,
                        textBox.position.y - textBox.fontSize + 5,
                        textBox.text.length * (textBox.fontSize / 2) + 10,
                        1 + +textBox.fontSize
                    );
                }

                if (textBox.whiteBox) {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(
                        textBox.position.x - canvas.width,
                        textBox.position.y - (textBox.fontSize + textBox.whiteBoxPadding) / 2 - textBox.fontSize / 4,
                        canvas.width * 2,
                        textBox.fontSize + textBox.whiteBoxPadding
                    );
                }

                if (textBox.sidebars) {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(0, 0, textBox.sidebarWidth, canvas.height);
                    ctx.fillRect(canvas.width - textBox.sidebarWidth, 0, textBox.sidebarWidth, canvas.height);
                }

                ctx.font = `${textBox.fontSize}px ${textBox.font || "Arial"}`;
                ctx.fillStyle = textBox.fontColor;

                // Split text into multiple lines if it's too long
                if (ctx.measureText(textBox.text).width > 500) {
                    const words = textBox.text.split(' ');
                    let line = '';
                    let y = textBox.position.y;
                    words.forEach(word => {
                        const testLine = line + word + ' ';
                        const testWidth = ctx.measureText(testLine).width;
                        if (testWidth > 500) {
                            ctx.fillText(line, textBox.position.x, y);
                            line = word + ' ';
                            y += textBox.fontSize + 5;
                        } else {
                            line = testLine;
                        }
                    });
                    ctx.fillText(line, textBox.position.x, y);
                } else {
                    ctx.fillText(textBox.text, textBox.position.x, textBox.position.y);
                }
            });
        }
    }

    /**
     * @description Handles the mouse down event on the text box
     * @param {number} index - Index of the text box
     * @param {React.MouseEvent<HTMLDivElement>} e - Mouse event
     * @returns void
     * */
    function handleMouseDown(index: number, e: React.MouseEvent<HTMLDivElement>) {
        setSelectedTextBox(index);
        setIsDragging(true);
    }

    /**
     * @description Handles the mouse move event on the canvas
     * @param {MouseEvent} e - Mouse event
     * @returns void
     * */
    function handleMouseMove(e: MouseEvent) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();

        // Return if mouse is outside the canvas
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
            return;
        }

        if (isDragging && selectedTextBox !== null) {

            const x = Math.min(Math.max(e.clientX - rect.left, 0), canvas.width);
            const y = Math.min(Math.max(e.clientY - rect.top, 0), canvas.height);

            setTextBoxes((prevTextBoxes) =>
                prevTextBoxes.map((textBox, index) =>
                    index === selectedTextBox ? {...textBox, position: {x, y}} : textBox
                )
            );
        }
    }

    /**
     * @description Handles the mouse up event on the canvas
     * @returns void
     * */
    function handleMouseUp() {
        setIsDragging(false);
        setTimeout(() => {
            setSelectedTextBox(null)
        }, 100);
    }

    /**
     * */
    function alignTextHorizontally(align: CanvasTextAlign) {
        if (selectedTextBox === null) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Align selected text box
        const textBox = textBoxes[selectedTextBox];
        if (!textBox) return;

        const textBoxWidth = textBox.text.length * (textBox.fontSize / 2)
        textBox.position.x = align === "center" ? canvas.width / 2 - textBoxWidth / 2 : align === "right" ? canvas.width - textBoxWidth : 0;
        setTextBoxes((prevTextBoxes) =>
            prevTextBoxes.map((tb, index) =>
                index === selectedTextBox ? {...tb, position: textBox.position} : tb
            )
        );
        renderCanvas();
    }

    function alignTextVertically(align: CanvasTextAlign) {
        if (selectedTextBox === null) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Align selected text box
        const textBox = textBoxes[selectedTextBox];
        if (!textBox) return;

        const textBoxHeight = textBox.fontSize;
        textBox.position.y = align === "center" ? (canvas.height - textBox.fontSize) / 2 : align === "end" ? canvas.height - textBox.whiteBoxPadding : textBox.fontSize;
        renderCanvas();
    }

    /**
     * @description Downloads the meme image
     * @returns void
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
            <aside className="bg-white rounded-lg p-6 w-80 flex flex-col gap-6 absolute left-0 shadow-lg">
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
                                    <Select onValueChange={(value: string) => field.onChange(value)}
                                            value={field.value}>
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
                        <FormField name="font-size" render={({field}) => (
                            <FormItem>
                                <FormLabel>Font size</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field}
                                           onChange={value => field.onChange(value)}
                                           value={field.value} min={1} max={72}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                        <FormField name="font-color" render={({field}) => (
                            <FormItem>
                                <FormLabel>Font color</FormLabel>
                                <FormControl>
                                    <Input type="color" {...field} value={field.value}/>
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
                        {form.getValues("toggle-white-box") &&
													<FormField name="white-box-padding" render={({field}) => (
                              <FormItem>
                                  <FormLabel>White box padding (vertical)</FormLabel>
                                  <FormControl>
                                      <Input type="number" {...field}
                                             onChange={value => field.onChange(value)}
                                             value={field.value} min={0} max={50}/>
                                  </FormControl>
                              </FormItem>
                          )}/>
                        }
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
                        {form.getValues("toggle-sidebars") && <FormField name="sidebars-width" render={({field}) => (
                            <FormItem>
                                <FormLabel>White box padding (vertical)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field}
                                           onChange={value => field.onChange(value)}
                                           value={field.value} min={0} max={256}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                        }
                        <Button type="submit" className="px-4">Add</Button>
                    </form>
                </Form>
            </aside>
            <div className="flex flex-col gap-12 mx-auto mt-6"
                 style={{width: `${CANVAS_HEIGHT}px`, height: `${CANVAS_HEIGHT}px`}}>
                <div className="bg-white rounded-lg shadow-lg p-4 flex justify-between">
                    <div className="flex justify-between gap-4">
                        <Button type="button" onClick={() => alignTextHorizontally("left")}
                                className="bg-gray-300 text-black">
                            <AlignLeft/>
                        </Button>
                        <Button type="button" onClick={() => alignTextHorizontally("center")}
                                className="bg-gray-300 text-black">
                            <AlignCenter/>
                        </Button>
                        <Button type="button" onClick={() => alignTextHorizontally("right")}
                                className="bg-gray-300 text-black">
                            <AlignRight/>
                        </Button>
                    </div>
                    <div className="flex justify-between gap-4">
                        <Button type="button" onClick={() => alignTextVertically("start")}
                                className="bg-gray-300 text-black">
                            <AlignStartHorizontal/>
                        </Button>
                        <Button type="button" onClick={() => alignTextVertically("center")}
                                className="bg-gray-300 text-black">
                            <AlignCenterHorizontal/>
                        </Button>
                        <Button type="button" onClick={() => alignTextVertically("end")}
                                className="bg-gray-300 text-black">
                            <AlignEndHorizontal/>
                        </Button>
                    </div>
                </div>
                <canvas style={{background: `url(${imageSrc}) no-repeat center`, backgroundSize: '512px 512px'}}
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        className="shadow-gray-400 shadow-lg"
                />
                <div className="w-full mx-auto flex gap-6">
                    <Button type="button" onClick={downloadMeme} className="px-4 w-full bg-gray-900">Download</Button>
                    <Button type="button" className="px-4 w-full bg-gray-700">Save</Button>
                </div>
            </div>
            <aside
                className={`bg-white rounded-lg p-6 w-80 flex flex-col gap-6 absolute right-0 top-0 shadow-lg max-h-[${CANVAS_HEIGHT}px] overflow-auto`}>
                <h2 className="text-xl">Text boxes</h2>
                <ul className="flex flex-col gap-4">
                    {textBoxes.length === 0 ?
                        <h4 className="text-gray-700">No text boxes in the image yet</h4> :
                        textBoxes.map((textBox, index) => (
                            <li key={index}>
                                <div
                                    className={`grid grid-cols-4 items-center gap-4 bg-gray-200 rounded-lg p-4 relative transition-all ${index === selectedTextBox ? 'bg-gray-700 text-white' : ''}`}
                                    onClick={e => handleMouseDown(index, e)}>
                                    <Button className="bg-red-400 w-fit absolute top-3 right-3"
                                            onClick={() => removeTextBox(index)}>
                                        <Trash2/>
                                    </Button>
                                    <span className="col-span-3 break-words overflow-ellipsis">{textBox.text}</span>
                                    {textBox.whiteBox &&
																			<span className="col-span-4 break-words overflow-ellipsis text-gray-500">
                                            White box padding: {textBox.whiteBoxPadding}px
                                        </span>
                                    }
                                    {textBox.sidebars &&
																			<span className="col-span-4 break-words overflow-ellipsis text-gray-500">
                                            Sidebar width: {textBox.sidebarWidth}px
                                        </span>
                                    }
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </aside>
        </section>
    );
};
