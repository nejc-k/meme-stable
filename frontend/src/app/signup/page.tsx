import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
  } from "@/components/ui/card"
import MaxWidthWrapper from "../components/MaxWidthWrapper";
import { SignUpForm } from "../components/SignUpForm";

interface User{
	username:string,
	password: string,
	location: string,
	contact:string,
}

export default async function Page() {
	return (
		<>
 		<MaxWidthWrapper>
			<div className="flex items-center mt-10">
			<Card className="w-80 flex flex-col mx-auto">
  			<CardHeader>
				<CardTitle className="text-xl md:text-2xl lg:text-3xl">Create an account</CardTitle>
				<></>
				<CardDescription>Create your account to start!</CardDescription>
  			</CardHeader>
			<CardContent>
				<SignUpForm/>	
			</CardContent>
			<CardFooter>
			</CardFooter>
		</Card>
		</div>
 		</MaxWidthWrapper>
		</>
	);
}