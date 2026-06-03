import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import AboutP from "./About"

export const metadata: Metadata = buildPageMetadata({
    title: "A propos",
    description:
        "Decouvrez Autoshop 65, station service a Tarbes avec mecanique automobile, retrait colis et vente de pieces d'occasion.",
    path: "/AboutPage",
});

export default function About(){
    return <>
    <AboutP/>
    </>
}
