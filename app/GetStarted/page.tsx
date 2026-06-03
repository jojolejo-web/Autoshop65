import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { GetStartedForm } from "./GetStartedForm";

export const metadata: Metadata = buildPageMetadata({
  title: "Creer un compte",
  description: "Creez votre compte client Autoshop 65 pour commander vos pieces d'occasion.",
  path: "/GetStarted",
  noIndex: true,
});

export default function GetStarted() {
  return (
    <main className="flex flex-1 w-full flex-col items-center justify-center px-16 py-32 bg-white dark:bg-black">
      <GetStartedForm />
    </main>
  );
}
