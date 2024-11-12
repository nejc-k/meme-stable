"use client";

import {useForm} from "react-hook-form";
import {Form, FormField, FormLabel, FormItem, FormControl} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuth} from "@/context/AuthContext";

const schema = z.object({
    username: z.string(),
    password: z.string()
        .min(8, {message: "Password must be at least 8 characters"}),
});

export default function LoginPage() {
    const {login} = useAuth();
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            username: "",
            password: "",
        }
    });

    /**
     * @description Handles form submission for logging in
     * @returns {Promise<void>}
     * */
    async function onSubmit(): Promise<void> {
        const {username, password} = form.getValues();
        await login(username, password);   // Method automatically redirects to images page
    }

    return (
        <section className="max-w-screen-md mx-auto bg-white rounded-lg shadow-lg">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 p-12">
                    <h1 className="text-2xl">Login</h1>
                    <FormField name="username" render={({field}) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input {...field}/>
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
