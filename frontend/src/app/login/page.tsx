"use client";

import {useForm} from "react-hook-form";
import {Form, FormField, FormLabel, FormItem, FormControl} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message: "Password must be at least 8 characters"}),
});

export default function LoginPage() {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    function onSubmit() {
        // TODO: Implement login logic
    }

    return (
        <section className="max-w-screen-md mx-auto bg-white rounded-lg shadow-lg">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 p-12">
                    <h1 className="text-2xl">Login</h1>
                    <FormField name="email" render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" {...field}/>
                            </FormControl>
                        </FormItem>
                    )}/>
                    <FormField name="password" render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field}/>
                            </FormControl>
                        </FormItem>
                    )}/>
                    <Button type="submit">Login</Button>
                </form>
            </Form>
        </section>
    );
};
