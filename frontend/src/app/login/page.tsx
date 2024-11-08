"use client"

import MaxWidthWrapper from "@/app/components/MaxWidthWrapper"
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

import { logIn,logOut } from "@/redux/features/auth-slice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";

export default  function LoginPage(){
	const router = useRouter()
	const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        router.prefetch('/generate')
      }, [router])

async function handleLogin (e : FormEvent<HTMLFormElement>){

		e.preventDefault()
		const formData = new FormData(e.currentTarget)

		const username = formData.get("username")?.toString()
		const password = formData.get("password")?.toString()

		if(!username && username !== "" || !password && password !== ""){
            alert("Enter the password and username")
			return
		}

		const user = {username:username, password:password}

		await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URI}/api/auth`, {
			method:"POST",
			"credentials":"include",
			headers:{
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user) 
		}).then((res)=>{
			if(res.ok){
				return res.json()
			}else{
                alert("Incorrect username or password")
                return
            }
		}).then((data)=>{
				dispatch(logIn({username: data.username, userId:data.userId}))
                router.push("/generate")
		})
	
	}

    return(
		<>
		<MaxWidthWrapper>
		   <div className="flex items-center mt-10">
		   <Card className="w-80 flex flex-col mx-auto">
			 <CardHeader>
			   <CardTitle className="text-xl md:text-2xl lg:text-3xl">Sign in</CardTitle>
			 </CardHeader>
		   <CardContent>
		   <form onSubmit={handleLogin} className="flex flex-col ">
			   <label htmlFor="username" >Username</label>
			   <Input type="username" name="username" id="username" placeholder="Username" />
			   <br />
			   <label htmlFor="password">Password</label>
			   <Input type="password" name="password" id="password" placeholder="Password"/>
			   <br />
			   <Button className="w-2/3 mx-auto mt-3" >Continue</Button>
			   
		   </form>
		   </CardContent>
		   <CardFooter>
		   </CardFooter>
	   </Card>
	   </div>
		</MaxWidthWrapper>
	   </>)
}