import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import RetraitColis from "./Colis";

export const metadata: Metadata = buildPageMetadata({
    title: "Retrait colis",
    description:
        "Informations sur le retrait colis traditionnel et locker automatique chez Autoshop 65.",
    path: "/RetraitColis",
});

export default function Colis(){
    return <RetraitColis/>
}
