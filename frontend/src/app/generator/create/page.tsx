"use client";

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {redirect} from "next/navigation";
import {useAuth} from "@/context/AuthContext";
import {api} from "@/lib/axios";

const schema = z.object({
    "template-id": z.string(),
    "image-prompt": z.string()
        .min(3, {message: "Prompt must be at least 3 characters"})
        .max(255, {message: "Prompt must be less than 255 characters"}),
    text: z.string()
        .max(255, {message: "Prompt must be less than 255 characters"}),
});

export default function GeneratorCreatePage() {
    const {user, updateUserCredits} = useAuth();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            "template-id": "",
            "image-prompt": "",
            text: "",
        }
    });

    async function onSubmit(values: z.infer<typeof schema>) {
        if (!user) return;

        console.log(values);
        updateUserCredits(-1);

        const response = await api.post('/generator', {prompt: values["image-prompt"]});
        if (response.status !== 201) {
            console.error("Error creating meme");
            return;
        }

        console.dir(response);
        const imageId = response.data.imgUrl.split('/').pop().split('.')[0];
        redirect("/generator/edit/" + imageId);
    }

    return (
        <section id="create-page" className="max-w-screen-xl mx-auto">
            <h1 className="text-center text-lg">Create a meme</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <FormField control={form.control} name="template-id" render={({field}) => (
                        <FormItem>
                            <FormLabel>Template</FormLabel>
                            <FormControl>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Template"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="image-prompt" render={({field}) => (
                        <FormItem>
                            <FormLabel>Image prompt</FormLabel>
                            <FormControl>
                                <Input className="bg-white" placeholder="Image prompt" {...field}/>
                            </FormControl>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="text" render={({field}) => (
                        <FormItem>
                            <FormLabel>Text</FormLabel>
                            <FormControl>
                                <Input className="bg-white" placeholder="Text" {...field}/>
                            </FormControl>
                        </FormItem>
                    )}/>
                    <Button type="submit" className="w-fit mx-auto mt-12 transition-all px-5">Generate</Button>
                </form>
            </Form>
        </section>
    );
};
