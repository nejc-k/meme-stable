"use client";

import {useForm} from "react-hook-form";
import {Form, FormField, FormLabel, FormItem, FormControl} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Switch} from "@/components/ui/switch";
import {useAuth} from "@/context/AuthContext";

/**
 * @description Schema for validating the sign-up (registration) form
 * */
const schema = z.object({
    username: z.string().min(3, {message: "Username must be at least 3 characters"}).max(255, {message: "Username must be less than 255 characters"}),
    name: z.string().min(3, {message: "Name must be at least 3 characters"}).max(255, {message: "Name must be less than 255 characters"}),
    lastname: z.string().min(3, {message: "Last name must be at least 3 characters"}).max(255, {message: "Last name must be less than 255 characters"}),
    email: z.string().email(),
    password: z.string().min(8, {message: "Password must be at least 8 characters"}),
    "confirm-password": z.string().min(8, {message: "Password must be at least 8 characters"}),
    terms: z.boolean().and(z.boolean().refine(value => value, {message: "You must agree to the terms and conditions"})),
});

export default function RegisterPage() {
    const {createAccount} = useAuth();
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

    /**
     * @description Function to handle the form submission, triggers createAccount function from AuthContext
     * @returns {Promise<void>}
     * */
    async function onSubmit(): Promise<void> {
        await createAccount({
                _id: "", // This is generated by the server
                username: form.getValues('username'),
                name: form.getValues('name'),
                lastname: form.getValues('lastname'),
                email: form.getValues('email'),
                credits: 0
            },
            form.getValues('password')
        );
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
                    <FormField name="confirm-password" render={({field}) => (
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
