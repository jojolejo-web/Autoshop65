import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import ContactPage from "./Contact";

export const metadata: Metadata = buildPageMetadata({
    title: "Contact",
    description:
        "Contactez Autoshop 65 pour la station service, la mecanique, les pieces d'occasion ou le retrait colis.",
    path: "/Contact",
});

export default function Contact(){
    return <ContactPage/>
}
