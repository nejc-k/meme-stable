"use client";

import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function ProfilePage() {
    const form = useForm({});

    return (
        <section
            className="max-w-screen-xl bg-white mx-auto shadow-lg shadow-gray-300 grid grid-cols-4 p-12 rounded-xl">
            <div>
                <div className="rounded-full bg-gray-300 w-72 h-72 grid place-items-center">
                    <span className="text-8xl">GU</span>
                </div>
            </div>
            <div className="col-span-3 ml-12">
                <h2 className="text-xl">Basic data</h2>
                <Form {...form}>
                    <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(() => {
                    })}>
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
                <Form {...form}>
                    <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(() => {
                    })}>
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
