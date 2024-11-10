"use client";

import {useForm} from "react-hook-form";
import {Form, FormField, FormLabel, FormItem, FormControl} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Switch} from "@/components/ui/switch";

const schema = z.object({
    username: z.string().min(3, {message: "Username must be at least 3 characters"}).max(255, {message: "Username must be less than 255 characters"}),
    name: z.string().min(3, {message: "Name must be at least 3 characters"}).max(255, {message: "Name must be less than 255 characters"}),
    lastname: z.string().min(3, {message: "Last name must be at least 3 characters"}).max(255, {message: "Last name must be less than 255 characters"}),
    email: z.string().email(),
    password: z.string().min(8, {message: "Password must be at least 8 characters"}),
    confirmPassword: z.string().min(8, {message: "Password must be at least 8 characters"}),
    terms: z.boolean().and(z.boolean().refine(value => value, {message: "You must agree to the terms and conditions"})),
});

export default function RegisterPage() {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            username: "",
            name: "",
            lastname: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
        }
    });

    function onSubmit() {
        // TODO: Implement register logic
    }

    return (
        <section className="max-w-screen-md mx-auto bg-white rounded-lg shadow-lg">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 p-12">
                    <h1 className="text-2xl">Creat an account</h1>
                    <div className="flex justify-between gap-6">
                        <FormField name="name" render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                        <FormField name="lastname" render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>Last name</FormLabel>
                                <FormControl>
                                    <Input {...field}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                    </div>
                    <FormField name="username" render={({field}) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input {...field}/>
                            </FormControl>
                        </FormItem>
                    )}/>
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
                    <FormField name="confirmPassword" render={({field}) => (
                        <FormItem>
                            <FormLabel>Confirm password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field}/>
                            </FormControl>
                        </FormItem>
                    )}/>
                    <FormField name="terms" render={({field}) => (
                        <FormItem className="flex items-center gap-4">
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel>I agree to the terms and conditions</FormLabel>
                        </FormItem>
                    )}/>
                    <Button type="submit">Create account</Button>
                </form>
            </Form>
        </section>
    );
};
