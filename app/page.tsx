import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const categories = [
    { name: "Moteur", icon: "🔧", color: "bg-red-500" },
    { name: "Carrosserie", icon: "🚗", color: "bg-red-500" },
    { name: "Suspension", icon: "⚙️", color: "bg-blue-500" },
  ];
  return (
    <>
      <main className=" ">
        <section className="relative bg-linear-to-br from-gray-900  px-16 via-black to-gray-900 text-white py-20 lg:py-32">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 mb-6 px-4 py-1">
                Save up to 70% on car parts
              </Badge>

              <div className="flex flex-col gap-4 items-center">
                <h1 className="text-center  text-4xl lg:text-6xl font-bold">
                  Pièces détachées d'occasion de qualité au meilleur prix
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Faites des économies et roulez de manière durable grâce à des
                  pièces automobiles d'occasion certifiées
                </p>
                <Link href="/Catalogue">
                  <Button
                    size="lg"
                    className="bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-6 text-lg"
                    variant={"destructive"}
                  >
                    Explorer <ChevronRight />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="px-48 lg:py-32 bg-gray-50">
          <h2 className="font-medium text-3xl text-center mb-8">
            Trouver des pièce dans notre Catalogue
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="group hover:shadow-xl transition-all cursor-pointer border hover:border-red-500"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`size-24 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 text-5xl group-hover:scale-110 transition-transform`}
                  >
                    {category.icon}
                  </div>
                  <p className="font-bold text-lg">{category.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section> */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
              <p className="text-gray-600 text-lg">
                Procurez-vous des pièces d'occasion de qualité en 3 étapes
                simples{" "}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center relative">
                <div className="size-20 bg-linear-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                  1
                </div>
                <h3 className="font-bold text-xl mb-3">Rechercher votre pièce</h3>
                <p className="text-gray-600">
                  Parcourez les catégories pour trouver la
                  pièce dont vous avez besoin
                </p>
                {/* Arrow for desktop */}
                <ChevronRight className="hidden md:block absolute -right-4 top-8 size-8 text-red-300" />
              </div>

              <div className="text-center relative">
                <div className="size-20 bg-linear-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                  2
                </div>
                <h3 className="font-bold text-xl mb-3">Comparer et choisir</h3>
                <p className="text-gray-600">
                  Consultez les photos détaillées, les caractéristiques techniques pour choisir
                  la pièce idéale
                </p>
                <ChevronRight className="hidden md:block absolute -right-4 top-8 size-8 text-red-300" />
              </div>

              <div className="text-center relative">
                <div className="size-20 bg-linear-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                  3
                </div>
                <h3 className="font-bold text-xl mb-3">Paiement sécurisé</h3>
                <p className="text-gray-600">
                  Payez en toute sécurité grâce à plusieurs modes de paiement.
                </p>
              </div>

              
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
