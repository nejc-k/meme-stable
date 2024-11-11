"use client"

import Link from "next/link"
import { useAppSelector } from "@/redux/store"
import { buttonVariants } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export  function GenerateForm() {
    const isLoggedIn = useAppSelector((state)=>state.authReducer.value.isAuth)
    const router = useRouter()
   useEffect(()=>{
    if(!isLoggedIn){
        router.replace("/login")
    }
   })
   return (
   <div className="flex ">
        {
            isLoggedIn ? (
            <>
            </>
            ):
            (
            <div className="mt-10" onClick={()=>{router.push("/login")}} >
                <Link href={"/login"} className={buttonVariants({variant:"outline"}) }>Log in to access this page</Link>
            </div>
            )
        }
    </div>
   )
}

export default GenerateForm