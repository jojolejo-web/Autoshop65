import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  ImageOff,
  MapPin,
  Phone,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { buildPageMetadata } from "@/lib/metadata";
import { company } from "@/lib/company";
import {
  catalogueCategories,
  getCategoryLabel,
  type CatalogueCategory,
} from "./Catalogue/categories";

export const metadata: Metadata = buildPageMetadata({
  title: "Accueil",
  description:
    "Pièces auto d'occasion contrôlées, moins chères que le neuf. Paiement en ligne sécurisé et retrait gratuit au magasin de Séméac, près de Tarbes.",
  path: "/",
});

const PHONE_DISPLAY = "05 62 95 21 75";
const PHONE_HREF = "tel:0562952175";
const MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=86+Avenue+Fran%C3%A7ois+Mitterrand+65600+S%C3%A9m%C3%A9ac";

const categoryHints: Record<CatalogueCategory, string> = {
  carroserie: "Portières, pare-chocs, rétroviseurs",
  moteur: "Moteurs, culasses, alternateurs",
  transmission: "Boîtes de vitesses, cardans",
  eclairage: "Phares, feux arrière",
  suspension: "Amortisseurs, triangles",
};

const guarantees = [
  { title: "Pièces contrôlées", text: "Vérifiées avant la mise en vente" },
  { title: "Retrait gratuit", text: "Au magasin de Séméac" },
  { title: "Paiement sécurisé", text: "Carte bancaire via Stripe" },
  { title: "Conseil par téléphone", text: "Du lundi au vendredi" },
];

type LatestProduct = {
  id: number;
  productName: string;
  reference: string | null;
  price: number;
  image: string | null;
  category: CatalogueCategory;
};

async function getHomeData() {
  try {
    const [latest, grouped] = await Promise.all([
      prisma.product.findMany({
        where: { stock: { gt: 0 } },
        orderBy: { id: "desc" },
        take: 8,
        select: {
          id: true,
          productName: true,
          reference: true,
          price: true,
          image: true,
          category: true,
        },
      }),
      prisma.product.groupBy({
        by: ["category"],
        where: { stock: { gt: 0 } },
        _count: { _all: true },
      }),
    ]);

    const counts = Object.fromEntries(
      grouped.map((row) => [row.category, row._count._all]),
    ) as Partial<Record<CatalogueCategory, number>>;

    return { latest: latest as LatestProduct[], counts };
  } catch (error) {
    console.error("Home data unavailable", error);
    return { latest: [] as LatestProduct[], counts: {} };
  }
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}

function imageSrc(image: string | null) {
  return image ? `/${image.replace(/^\/+/, "")}` : null;
}

function SectionHeader({
  title,
  text,
  link,
}: {
  title: string;
  text?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
          {title}
        </h2>
        {text ? <p className="mt-2 text-zinc-600">{text}</p> : null}
      </div>
      {link ? (
        <Link
          href={link.href}
          className="inline-flex items-center gap-1 text-sm font-medium text-zinc-950 hover:text-red-700 hover:underline"
        >
          {link.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}

export default async function Home() {
  const { latest, counts } = await getHomeData();

  return (
    <main className="bg-white text-zinc-950">
      {/* ───────────── HAUT DE PAGE ───────────── */}
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Pièces auto d&apos;occasion <span className="text-red-500">contrôlées</span>, près de Tarbes
            </h1>
            <p className="mt-4 max-w-xl text-lg text-zinc-300">
              Des pièces démontées et vérifiées par notre équipe, moins chères
              que le neuf. Payez en ligne et récupérez votre commande au
              magasin de Séméac.
            </p>

            <form
              action="/Catalogue"
              method="get"
              role="search"
              className="mt-8 flex max-w-xl gap-2"
            >
              <input type="hidden" name="page" value="1" />
              <label htmlFor="home-search" className="sr-only">
                Rechercher une pièce
              </label>
              <div className="flex flex-1 items-center gap-2 rounded-lg bg-white px-3 text-zinc-950 focus-within:ring-4 focus-within:ring-red-500/40">
                <Search className="size-5 shrink-0 text-zinc-500" aria-hidden="true" />
                <input
                  id="home-search"
                  name="search"
                  type="search"
                  placeholder="Nom de la pièce, modèle…"
                  className="h-12 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-zinc-500"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 rounded-lg bg-red-600 px-6 text-base text-white hover:bg-red-700"
              >
                Rechercher
              </Button>
            </form>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-200">
              {guarantees.slice(0, 3).map(({ title }) => (
                <li key={title} className="flex items-center gap-1.5">
                  <Check className="size-4 text-red-500" aria-hidden="true" />
                  {title}
                </li>
              ))}
            </ul>
          </div>

          {/* Fiche magasin : des infos réelles et vérifiables */}
          <div className="rounded-xl border-t-4 border-red-600 bg-white p-6 text-zinc-950 shadow-xl">
            <div className="flex items-center gap-3">
              <Image
                src="/logoAutoshop65.png"
                alt=""
                width={56}
                height={56}
                className="rounded-md border border-zinc-200"
              />
              <div>
                <p className="font-semibold">Autoshop 65</p>
                <p className="text-sm text-zinc-600">Mécanique &amp; pièces d&apos;occasion</p>
              </div>
            </div>

            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden="true" />
                <div>
                  <p className="font-medium">86 av. François Mitterrand, 65600 Séméac</p>
                  <a
                    href={MAPS_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-600 underline underline-offset-2 hover:text-zinc-950"
                  >
                    Voir l&apos;itinéraire
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden="true" />
                <p>
                  <span className="font-medium">Lundi – vendredi, 8h – 18h</span>
                  <br />
                  <span className="text-zinc-600">Fermé le week-end</span>
                </p>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden="true" />
                <a href={PHONE_HREF} className="font-medium hover:underline">
                  {PHONE_DISPLAY}
                </a>
              </li>
            </ul>

            <Button asChild className="mt-6 h-11 w-full rounded-lg bg-zinc-950 text-white hover:bg-zinc-800">
              <a href={PHONE_HREF}>
                <Phone aria-hidden="true" /> Une question ? Appelez-nous
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ───────────── ENGAGEMENTS ───────────── */}
      <section aria-label="Nos engagements" className="bg-red-700 text-white">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-5 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
          {guarantees.map(({ title, text }) => (
            <li key={title} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
                <Check className="size-4 text-red-700" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-red-100">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────────── CATÉGORIES ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader
          title="Parcourir par catégorie"
          link={{ href: "/Catalogue", label: "Tout le catalogue" }}
        />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {catalogueCategories.map(({ value, label }) => {
            const count = counts[value] ?? 0;
            return (
              <li key={value}>
                <Link
                  href={`/Catalogue?category=${value}&page=1`}
                  className="group flex h-full flex-col rounded-xl border border-zinc-200 border-l-4 border-l-red-600 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-950 hover:border-l-red-600 hover:shadow-md"
                >
                  <span className="flex items-center justify-between font-semibold">
                    {label}
                    <ChevronRight
                      className="size-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-950"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1 text-sm text-zinc-600">{categoryHints[value]}</span>
                  {count > 0 ? (
                    <span className="mt-3 text-xs font-semibold text-red-700">
                      {`${count} pièce${count > 1 ? "s" : ""} en stock`}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ───────────── DERNIÈRES PIÈCES ───────────── */}
      {latest.length > 0 ? (
        <section className="bg-zinc-100">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeader
              title="Dernières pièces ajoutées"
              text="Chaque pièce d'occasion est disponible en un seul exemplaire."
              link={{ href: "/Catalogue", label: "Voir toutes les pièces" }}
            />
            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {latest.map((product) => {
                const src = imageSrc(product.image);
                return (
                  <li key={product.id}>
                    <Link
                      href={`/Catalogue/${product.id}`}
                      className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200 transition-shadow hover:shadow-lg hover:ring-zinc-950"
                    >
                      <div className="relative aspect-square bg-zinc-100">
                        {src ? (
                          <Image
                            src={src}
                            alt={product.productName}
                            fill
                            sizes="(max-width: 1024px) 50vw, 25vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ImageOff className="size-8 text-zinc-400" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <p className="text-xs text-zinc-500">
                          {getCategoryLabel(product.category)}
                          {product.reference ? ` · Réf. ${product.reference}` : ""}
                        </p>
                        <h3 className="mt-1 line-clamp-2 flex-1 text-sm font-medium group-hover:underline sm:text-base">
                          {product.productName}
                        </h3>
                        <p className="mt-3 text-xl font-bold text-red-700">
                          {formatPrice(product.price)}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-emerald-700">
                          <Check className="size-3.5" aria-hidden="true" />
                          En stock · retrait à Séméac
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ───────────── COMMENT ÇA MARCHE ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader title="Comment commander" />
        <ol className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Trouvez votre pièce",
              text: "Recherchez par nom ou par catégorie. Chaque fiche affiche des photos réelles et la référence.",
            },
            {
              title: "Payez en ligne",
              text: "Paiement par carte bancaire, sécurisé par Stripe. La pièce vous est réservée.",
            },
            {
              title: "Retirez au magasin",
              text: "Venez la chercher à Séméac du lundi au vendredi, de 8h à 18h. Le retrait est gratuit.",
            },
          ].map(({ title, text }, index) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-600 font-bold text-white">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────────── LE MAGASIN ───────────── */}
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative aspect-4/3 overflow-hidden rounded-xl">
            <Image
              src="/LockerLoin.webp"
              alt="La devanture du magasin Autoshop 65 à Séméac"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Un magasin physique à Séméac
            </h2>
            <p className="mt-3 text-zinc-300">
              Autoshop 65 est un commerce local : vous récupérez votre pièce au
              comptoir et notre équipe répond à vos questions. Sur place, nous
              proposons aussi :
            </p>

            <ul className="mt-6 divide-y divide-white/15 border-y border-white/15">
              {[
                { label: "Mécanique automobile", text: "Entretien et réparation", href: "/Contact" },
                { label: "Station service", text: "Carburant", href: "/AboutPage" },
                { label: "Retrait de colis", text: "Point de retrait", href: "/RetraitColis" },
              ].map(({ label, text, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group flex items-center justify-between py-3"
                  >
                    <span>
                      <span className="font-medium group-hover:underline">{label}</span>
                      <span className="ml-2 text-sm text-zinc-400">{text}</span>
                    </span>
                    <ChevronRight className="size-4 text-red-500 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11 rounded-lg bg-red-600 text-white hover:bg-red-700">
                <Link href="/Catalogue">Voir les pièces disponibles</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 rounded-lg border-white bg-transparent text-white hover:bg-white hover:text-zinc-950">
                <Link href="/Contact">Nous contacter</Link>
              </Button>
            </div>

            <p className="mt-6 text-xs text-zinc-400">
              {company.legalName} · SARL · SIRET {company.siret} ·{" "}
              <Link href="/mentions-legales" className="underline underline-offset-2 hover:text-white">
                Mentions légales
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
