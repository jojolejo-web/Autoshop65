import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import {LoginForm} from "./LoginForm"

export const metadata: Metadata = buildPageMetadata({
    title: "Connexion",
    description: "Connectez-vous a votre compte Autoshop 65.",
    path: "/LogIn",
    noIndex: true,
});

export default function LogIn(){
    return <main className="flex flex-1 w-full flex-col items-center justify-center px-16 py-32 bg-white dark:bg-black">
        <LoginForm/>
    </main>
}
