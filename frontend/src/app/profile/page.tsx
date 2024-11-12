"use client";

import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {useAuth} from "@/context/AuthContext";
import React, {useState} from "react";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

/**
 * @description Schema for form validation for user related data
 * */
const userDataSchema = z.object({
    username: z.string().min(3, {message: "Username must have at least 3 characters"}),
    "first-name": z.string().min(2, {message: "Name must have at least 2 characters"}),
    "last-name": z.string().min(2, {message: "Last name must have at least 2 characters"}),
});

/**
 * @description Schema for form validation for password change
 * */
const userPasswordSchema = z.object({
    "current-password": z.string().min(8, {message: "Password must be at least 8 characters"}),
    "new-password": z.string().min(8, {message: "Password must be at least 8 characters"}),
    "repeat-password": z.string().min(8, {message: "Password must be at least 8 characters"}),
});

export default function ProfilePage() {
    const [messageData, setMessageData] = useState<{ title: string, text: string }>({title: "", text: ""});
    const [messagePassword, setMessagePassword] = useState<{ title: string, text: string }>({title: "", text: ""});
    const {user, updateAccount, updatePassword, logout} = useAuth();

    const userDataForm = useForm({
        resolver: zodResolver(userDataSchema),
        defaultValues: {
            username: user?.username ?? "",
            "first-name": user?.name ?? "",
            "last-name": user?.lastname ?? "",
        }
    });

    const userPasswordForm = useForm({
        resolver: zodResolver(userPasswordSchema),
        defaultValues: {
            "current-password": "",
            "new-password": "",
            "repeat-password": "",
        }
    });

    /**
     * @description Updates user data such as username, name and last name
     * @returns Promise<void>
     * */
    async function updateUserData(): Promise<void> {
        if (!user) return;

        await updateAccount({
            ...user,
            username: userDataForm.getValues('username'),
            name: userDataForm.getValues('first-name'),
            lastname: userDataForm.getValues('last-name')
        });
    }

    /**
     * @description Updates user password after checking if new password and repeated password match
     * @returns Promise<void>
     * */
    async function updateUserPassword(): Promise<void> {
        if (!user) return;

        const currentPassword: string = userPasswordForm.getValues('current-password');
        const newPassword: string = userPasswordForm.getValues('new-password');
        const repeatPassword: string = userPasswordForm.getValues('repeat-password');

        if (newPassword !== repeatPassword) {
            setMessagePassword({title: "Error", text: "Passwords do not match"});
            return;
        }

        await updatePassword(newPassword);
    }

    return (
        !user ? <span className="inline-block mx-auto w-fit">Loading...</span> :
            <section
                className="max-w-screen-xl bg-white mx-auto shadow-lg shadow-gray-300 grid grid-cols-4 p-12 rounded-xl">
                <div>
                    <div className="rounded-full bg-gray-300 w-72 h-72 grid place-items-center">
                        <span className="text-8xl">
                            {user.name.charAt(0).toUpperCase()}
                            {user.lastname.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <Button type="button" className="mt-6 w-full bg-gray-500" onClick={logout}>Logout</Button>
                </div>
                <div className="col-span-3 ml-12">
                    <h2 className="text-xl">Basic data</h2>
                    {messageData.title!! && <Alert className="mb-6 border border-red-400 bg-red-200 text-red-500">
											<AlertTitle>{messageData.title}</AlertTitle>
											<AlertDescription>{messageData.text}</AlertDescription>
										</Alert>
                    }
                    <Form {...userDataForm}>
                        <form className="flex flex-col gap-6" onSubmit={userDataForm.handleSubmit(updateUserData)}>
                            <FormField name="username" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}/>
                            <div className="flex justify-between gap-12">
                                <FormField name="first-name" render={({field}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>First name</FormLabel>
                                        <FormControl>
                                            <Input {...field}/>
                                        </FormControl>
                                    </FormItem>
                                )}/>
                                <FormField name="last-name" render={({field}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Last name</FormLabel>
                                        <FormControl>
                                            <Input {...field}/>
                                        </FormControl>
                                    </FormItem>
                                )}/>
                            </div>
                            <Button type="submit" className="w-fit transition-all px-5">
                                Update profile data
                            </Button>
                        </form>
                    </Form>
                    <hr className="my-12"/>
                    <h2 className="text-xl">Password reset</h2>
                    {messagePassword.title!! && <Alert className="mb-6 border border-red-400 bg-red-200 text-red-500">
											<AlertTitle>{messagePassword.title}</AlertTitle>
											<AlertDescription>{messagePassword.text}</AlertDescription>
										</Alert>
                    }
                    <Form {...userPasswordForm}>
                        <form className="flex flex-col gap-6"
                              onSubmit={userPasswordForm.handleSubmit(updateUserPassword)}>
                            <FormField name="current-password" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Current password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}/>
                            <FormField name="new-password" render={({field}) => (
                                <FormItem>
                                    <FormLabel>New password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}/>
                            <FormField name="repeat-password" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Repeat password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}/>
                            <Button type="submit" className="w-fit transition-all px-5">
                                Change password
                            </Button>
                        </form>
                    </Form>
                </div>
            </section>
    );
};
