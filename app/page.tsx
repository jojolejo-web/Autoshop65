import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Accueil",
  description:
    "Station service, mecanique automobile, retrait colis Cdiscount et vente de pieces detachees d'occasion a Tarbes.",
  path: "/",
});

export default function Home() {
  return (
    <main>
      <section className="relative bg-linear-to-br from-gray-900 via-black to-gray-900 px-16 py-20 text-white lg:py-32">
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-linear-to-r from-red-500 to-red-600 px-4 py-1 text-white hover:from-red-600 hover:to-red-700">
              Save up to 70% on car parts
            </Badge>

            <div className="flex flex-col items-center gap-4">
              <h1 className="text-center text-4xl font-bold lg:text-6xl">
                Pieces detachees d&apos;occasion de qualite au meilleur prix
              </h1>
              <p className="mb-8 text-xl text-gray-300">
                Faites des economies et roulez de maniere durable grace a des
                pieces automobiles d&apos;occasion certifiees
              </p>
              <Link href="/Catalogue">
                <Button
                  size="lg"
                  className="bg-linear-to-r from-red-500 to-red-600 px-8 py-6 text-lg text-white hover:from-red-600 hover:to-red-700"
                  variant="destructive"
                >
                  Explorer <ChevronRight />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Comment ca marche</h2>
            <p className="text-lg text-gray-600">
              Procurez-vous des pieces d&apos;occasion de qualite en 3 etapes
              simples
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            <div className="relative text-center">
              <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-red-700 text-3xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-xl font-bold">
                Rechercher votre piece
              </h3>
              <p className="text-gray-600">
                Parcourez les categories pour trouver la piece dont vous avez
                besoin
              </p>
              <ChevronRight className="absolute -right-4 top-8 hidden size-8 text-red-300 md:block" />
            </div>

            <div className="relative text-center">
              <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-red-700 text-3xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-xl font-bold">Comparer et choisir</h3>
              <p className="text-gray-600">
                Consultez les photos detaillees et les caracteristiques
                techniques pour choisir la piece ideale
              </p>
              <ChevronRight className="absolute -right-4 top-8 hidden size-8 text-red-300 md:block" />
            </div>

            <div className="relative text-center">
              <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-red-700 text-3xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-xl font-bold">Paiement securise</h3>
              <p className="text-gray-600">
                Payez en toute securite grace a plusieurs modes de paiement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
