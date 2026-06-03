import Link from "next/link";
import {LoginForm} from "./LoginForm"
export default function LogIn(){
    return <main className="flex flex-1 w-full flex-col items-center justify-center px-16 py-32 bg-white dark:bg-black">
        <LoginForm/>
    </main>
}