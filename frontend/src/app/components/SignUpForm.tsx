"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { FormEvent } from "react"



export function SignUpForm(){
    const router = useRouter()

	async function handleSubmit (e : FormEvent<HTMLFormElement>){
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		console.log(Object.fromEntries(formData))
		const username = formData.get("username")?.toString()
		const password = formData.get("password")?.toString()

		const user = {username:username, password:password}
		await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URI}/users`, {
			method:"POST",
			body: JSON.stringify(user),
			headers: {
				"Content-Type": "application/json", 
          		credentials: "include", 
			  },
		}).then((res)=>{
			if(res.ok){
				router.push(`${process.env.NEXT_PUBLIC_FRONTEND_BASE_URI}/login`)
				
			}
		})

	}


return(
<form onSubmit={handleSubmit} className="flex flex-col ">
				<label htmlFor="username" >Username</label>
				<Input  type="username" name="username" id="username" placeholder="Username" />
				<br />
				<label htmlFor="password">Password</label>
				<Input type="password" name="password" id="password" placeholder="Password"/>
			
				<br />
				<Button className="w-2/3 mx-auto mt-3">Continue</Button>
				
			</form>
            )
}

