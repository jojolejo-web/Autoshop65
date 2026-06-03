import {
  ShieldCheck,
  Wrench,
  Package,
  MapPin,
  Clock,
  Users,
  Star,
  Truck,
  BadgeCheck,
  Recycle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Fiabilité",
    desc: "Chaque pièce est vérifiée et testée avant d'être mise en vente. Vous achetez en toute confiance.",
  },
  {
    icon: Recycle,
    title: "Économie circulaire",
    desc: "Donner une seconde vie aux pièces automobiles, c'est bon pour la planète.",
  },
  {
    icon: BadgeCheck,
    title: "Transparence",
    desc: "État, origine : toutes les infos sur chaque pièce, sans mauvaise surprise.",
  },
  {
    icon: Users,
    title: "Proximité",
    desc: "Une équipe locale à votre écoute, disponible par téléphone, email ou directement en magasin.",
  },
];

const STATS = [
  { value: "3 000+", label: "Pièces en stock" },
  { value: "98%", label: "Clients satisfaits" },
  { value: "2 ans", label: "D'expérience" },
  { value: "3", label: "Catégories de pièces" },
];

const CATEGORIES = [
  {
    icon: Wrench,
    name: "Moteur",
    desc: "Culasses, blocs moteur, turbos, alternateurs, démarreurs, courroies et tout ce qui fait tourner votre véhicule.",
  },
  {
    icon: ShieldCheck,
    name: "Carrosserie",
    desc: "Portes, capots, ailes, pare-chocs, rétroviseurs et éléments de structure — pour redonner fière allure à votre voiture.",
  },
  {
    icon: Star,
    name: "Suspension",
    desc: "triangles, biellettes et tout ce qui garantit tenue de route et confort de conduite.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Trouvez votre pièce",
    desc: "Parcourez notre catalogue ou utilisez la recherche pour trouver la pièce compatible avec votre véhicule.",
  },
  {
    num: "02",
    title: "Passez commande",
    desc: "Ajoutez au panier et validez votre commande en quelques clics.",
  },
  {
    num: "03",
    title: "Retirez votre colis",
    desc: "Venez chercher votre commande en magasin sur présentation de votre pièce d'identité.",
  },
];

export default function About() {
  return <main className="min-h-screen bg-gray-50 ">
    

    <div className="bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-red-500">{value}</p>
              <p className="text-gray-300 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="container mx-auto  py-16 space-y-20 px-16">
      <section className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-red-100 text-red-600 font-semibold text-sm px-3 py-1 rounded-full mb-4">
            Notre histoire
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Qui sommes-nous ?
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              AUTOSHOP 65 est une entreprise basée à Séméac, dans les
              Hautes-Pyrénées. Depuis notre création, nous nous sommes
              spécialisés dans la mécanique et vente de{" "}
              <strong className="text-gray-900">
                pièces automobiles d'occasion
              </strong>{" "}
              pour particuliers et professionnels.
            </p>
            <p>
              Notre mission est simple : vous fournir des pièces fiables à prix
              juste. 
              
            </p>
            <p>
              Chaque pièce en stock est soigneusement sélectionnée, contrôlée et
              référencée pour que vous puissiez acheter en connaissance de
              cause.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="bg-red-600 rounded-2xl p-8 text-white">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-5 text-center">
                <Wrench className="size-8 mx-auto mb-3" />
                <p className="font-semibold text-sm">Mécanique</p>
              </div>
              <div className="bg-white/10 rounded-xl p-5 text-center">
                <Package className="size-8 mx-auto mb-3" />
                <p className="font-semibold text-sm">Retrait en magasin</p>
              </div>
              <div className="bg-white/10 rounded-xl p-5 text-center">
                <Clock className="size-8 mx-auto mb-3" />
                <p className="font-semibold text-sm">Locker 24h/24</p>
              </div>
              <div className="bg-white/10 rounded-xl p-5 text-center">
                <MapPin className="size-8 mx-auto mb-3" />
                <p className="font-semibold text-sm">Séméac — 65600</p>
              </div>
            </div>
           
          </div>
        </div>
      </section>

      <section>
        <div className="text-center mb-10">
          <span className="inline-block bg-red-100 text-red-600 font-semibold text-sm px-3 py-1 rounded-full mb-4">
            Ce qui nous distingue
          </span>
          <h2 className="text-3xl font-bold text-gray-900">Nos valeurs</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6 text-center">
                <div className="inline-flex bg-red-600 text-white rounded-full p-4 mb-4">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Our categories */}
      <section>
        <div className="text-center mb-10">
          <span className="inline-block bg-red-100 text-red-600 font-semibold text-sm px-3 py-1 rounded-full mb-4">
            Notre stock
          </span>
          <h2 className="text-3xl font-bold text-gray-900">
            Nos 3 catégories de pièces
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Nous nous concentrons sur trois familles de pièces pour vous offrir
            le meilleur choix dans chaque domaine.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {CATEGORIES.map(({ icon: Icon, name, desc }) => (
            <Card
              key={name}
              className="border-l-4 border-l-red-600 hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-red-600 text-white rounded-lg p-2">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="text-center mb-10">
          <span className="inline-block bg-red-100 text-red-600 font-semibold text-sm px-3 py-1 rounded-full mb-4">
            Simple et rapide
          </span>
          <h2 className="text-3xl font-bold text-gray-900">
            Comment ça marche ?
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-red-200" />
          {STEPS.map(({ num, title, desc }) => (
            <div key={num} className="text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white text-xl font-bold mb-4 mx-auto">
                {num}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black rounded-2xl p-10 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">
          Une question ? Besoin d'une pièce précise ?
        </h2>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          Notre équipe est disponible pour vous aider à trouver la pièce
          compatible avec votre véhicule.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/Contact"
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Nous contacter
          </Link>
          <Link
            href="/Catalogue"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Voir le catalogue
          </Link>
        </div>
      </section>
    </div>
  </main>;
}
