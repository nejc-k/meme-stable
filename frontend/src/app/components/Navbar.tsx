"use client"
import Link from "next/link"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { Button, buttonVariants  } from "@/components/ui/button"
import { AppDispatch, useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"
import { logOut } from "@/redux/features/auth-slice"
import { useRouter } from "next/navigation"


export  function Navbar() {
    const dispatch = useDispatch<AppDispatch>()
    const username = useAppSelector((state)=>state.authReducer.value.username)
    const isLoggedIn = useAppSelector((state)=>state.authReducer.value.isAuth)
    const router = useRouter()


    const signOut = ()=>{
        // fetch
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URI}/api/auth/logout`,
            {
                method:"POST",
			    "credentials":"include",
            }
        )
        .then(
            (res)=>{
                if(res.ok){
                    dispatch(logOut())
                    router.push(`/`)
                }
            }
        )
    }

   return (
   <nav className="sticsky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop:blur-lg transition-all">
        <MaxWidthWrapper>
            {/* <div className="flex h-14 items-center justify-between border-b border-zinc-200"> */}
                <div className="flex h-14 items-center justify-between border-b border-zinc-200">
                <Link href="/" className="flex z-40 font-semibold">
                Meme<span className="text-red-500">Generator</span>
                </Link>
            
            
            <div className="h-full flex items-center space-x-4">
               {isLoggedIn ? (
                <>
                    <Link href={"/generate"} className={buttonVariants({variant:"link"})}>Generate</Link>
                    <Button variant={"ghost"} onClick={signOut}>Sign out</Button>

                    <Link href={"/"} className={buttonVariants({variant:"link"})}>{username}</Link>

                </>
                ) : 
                (<>

                 <Link href={"/login"}  className={buttonVariants({variant:"outline"})}>Sign in</Link>
                 <Link href={"/signup"} className={buttonVariants({variant:"default"})}>Register</Link>
                </>
                )} 
            
            </div>   
             <>
           </>

            </div >
        </MaxWidthWrapper>
    </nav>
   )
}

export default Navbar