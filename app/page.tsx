import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Barlow_Condensed, Permanent_Marker } from "next/font/google";
import { ArrowRight, ArrowUpRight, ImageOff, Phone, Search } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { buildPageMetadata } from "@/lib/metadata";
import {
  catalogueCategories,
  getCategoryLabel,
  type CatalogueCategory,
} from "./Catalogue/categories";

export const metadata: Metadata = buildPageMetadata({
  title: "Accueil",
  description:
    "Pièces auto d'occasion testées, jusqu'à 70 % moins chères que le neuf. Paiement en ligne et retrait gratuit à Séméac, près de Tarbes.",
  path: "/",
});

// Lettrage du logo : italique, gras, condensé.
const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

// Le marqueur des étiquettes de prix.
const marker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const PHONE_DISPLAY = "05 62 95 21 75";
const PHONE_HREF = "tel:0562952175";
const MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=86+Avenue+Fran%C3%A7ois+Mitterrand+65600+S%C3%A9m%C3%A9ac";

const categoryHints: Record<CatalogueCategory, string> = {
  carroserie: "Portières, pare-chocs, rétros, capots",
  moteur: "Blocs, culasses, alternateurs, démarreurs",
  transmission: "Boîtes de vitesses, cardans, embrayages",
  eclairage: "Phares, feux arrière, clignotants",
  suspension: "Amortisseurs, triangles, ressorts",
};

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
    const [latest, grouped, total] = await Promise.all([
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
      prisma.product.count({ where: { stock: { gt: 0 } } }),
    ]);

    const counts = Object.fromEntries(
      grouped.map((row) => [row.category, row._count._all]),
    ) as Partial<Record<CatalogueCategory, number>>;

    return { latest: latest as LatestProduct[], counts, total };
  } catch (error) {
    console.error("Home data unavailable", error);
    return { latest: [] as LatestProduct[], counts: {}, total: 0 };
  }
}

function formatPrice(amount: number) {
  const euros = amount / 100;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: Number.isInteger(euros) ? 0 : 2,
  }).format(euros);
}

function imageSrc(image: string | null) {
  return image ? `/${image.replace(/^\/+/, "")}` : null;
}

/** Étiquette en carton accrochée à la pièce, prix écrit au marqueur. */
function PriceTag({
  price,
  label,
  className = "",
  size = "md",
}: {
  price: string;
  label?: string;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <div
      className={`relative bg-[#d8b98a] text-zinc-950 shadow-[2px_3px_0_rgba(0,0,0,0.35)] [clip-path:polygon(14%_0,100%_0,100%_100%,14%_100%,0_50%)] ${
        size === "lg" ? "py-3 pl-12 pr-5" : "py-1.5 pl-7 pr-3"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-zinc-950/80 ${
          size === "lg" ? "left-4 size-3" : "left-2.5 size-2"
        }`}
      />
      {label ? (
        <span className="block text-[11px] font-semibold uppercase leading-tight">
          {label}
        </span>
      ) : null}
      <span
        className={`${marker.className} block leading-none ${
          size === "lg" ? "text-4xl" : "text-xl"
        }`}
      >
        {price}
      </span>
    </div>
  );
}

export default async function Home() {
  const { latest, counts, total } = await getHomeData();
  const featured = latest[0];
  const featuredImage = (featured && imageSrc(featured.image)) || "/14less/20614lessFace.jpeg";
  const heading = `${display.className} font-black italic uppercase leading-[0.85] tracking-tight`;

  return (
    <main className="bg-[#f3f1ec] text-zinc-950">
      {/* ───────────── HAUT DE PAGE ───────────── */}
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="flex flex-col justify-center px-4 py-14 sm:px-8 lg:py-24 lg:pl-10 lg:pr-12">
            <p className="text-sm font-medium text-zinc-400">
              Autoshop 65 — Séméac, à côté de Tarbes
            </p>

            <h1 className={`${heading} mt-4 text-6xl sm:text-7xl xl:text-8xl`}>
              Pièces
              <br />
              d&apos;occasion
              <br />
              <span className="text-red-500">testées.</span>
            </h1>

            <p className="mt-6 max-w-md text-lg text-zinc-300">
              Démontées et vérifiées chez nous, vendues jusqu&apos;à 70 % moins
              cher que le neuf. Vous payez en ligne, vous passez la chercher.
            </p>

            <form
              action="/Catalogue"
              method="get"
              role="search"
              className="mt-8 flex max-w-lg border-2 border-white"
            >
              <input type="hidden" name="page" value="1" />
              <label htmlFor="home-search" className="sr-only">
                Rechercher une pièce
              </label>
              <input
                id="home-search"
                name="search"
                type="search"
                placeholder="Rétro Clio 2, alternateur…"
                className="h-14 min-w-0 flex-1 bg-white px-4 text-base text-zinc-950 outline-none placeholder:text-zinc-500"
              />
              <button
                type="submit"
                className="flex h-14 items-center gap-2 bg-red-600 px-5 font-bold uppercase text-white transition-colors hover:bg-red-700"
              >
                <Search className="size-5" aria-hidden="true" />
                <span className="hidden sm:inline">Chercher</span>
                <span className="sr-only sm:hidden">Chercher</span>
              </button>
            </form>

            <p className="mt-4 text-sm text-zinc-400">
              Ou appelez-nous, on regarde dans le stock :{" "}
              <a href={PHONE_HREF} className="font-semibold text-white underline underline-offset-4 hover:text-red-400">
                {PHONE_DISPLAY}
              </a>
            </p>
          </div>

          <div className="relative min-h-[420px] overflow-hidden lg:min-h-[640px]">
            <Image
              src={featuredImage}
              alt={featured ? featured.productName : "Boîte de vitesses d'occasion démontée dans notre atelier"}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-zinc-950/70 via-transparent to-transparent" />

            <span
              aria-hidden="true"
              className={`${display.className} absolute right-6 top-6 rotate-[-8deg] border-4 border-red-600 bg-[#f3f1ec]/90 px-3 py-0.5 text-2xl font-black uppercase tracking-wider text-red-600 shadow-[2px_3px_0_rgba(0,0,0,0.35)] sm:right-8 sm:text-4xl`}
            >
              Contrôlée
            </span>

            {featured ? (
              <Link
                href={`/Catalogue/${featured.id}`}
                className="absolute bottom-6 left-5 right-5 flex items-end justify-between gap-4 sm:left-8"
              >
                <div className="text-white">
                  <p className="text-xs font-semibold uppercase text-zinc-300">
                    Dernier arrivage
                  </p>
                  <p className="mt-1 line-clamp-2 max-w-xs text-xl font-bold underline-offset-4 hover:underline">
                    {featured.productName}
                  </p>
                </div>
                <PriceTag price={formatPrice(featured.price)} size="lg" className="shrink-0 -rotate-6" />
              </Link>
            ) : (
              <p className="absolute bottom-6 left-5 text-sm text-zinc-200 sm:left-8">
                Photo réelle, prise au magasin.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ───────────── ENGAGEMENTS ───────────── */}
      <section aria-label="Nos engagements" className="border-y-2 border-zinc-950 bg-white">
        <p
          className={`${display.className} mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-4 text-center text-xl font-bold italic uppercase sm:text-2xl`}
        >
          <span>Pièces testées</span>
          <span aria-hidden="true" className="text-red-600">/</span>
          <span>Retrait gratuit au magasin</span>
          <span aria-hidden="true" className="text-red-600">/</span>
          <span>Paiement CB sécurisé</span>
          <span aria-hidden="true" className="text-red-600">/</span>
          <span>Jusqu&apos;à -70 %</span>
        </p>
      </section>

      {/* ───────────── RAYONS ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="flex flex-col justify-between gap-3 border-b-2 border-zinc-950 pb-4 sm:flex-row sm:items-end">
          <h2 className={`${heading} text-5xl sm:text-6xl`}>Les rayons</h2>
          {total > 0 ? (
            <p className="text-zinc-700">
              {`${total} pièce${total > 1 ? "s" : ""} en stock aujourd'hui`}
            </p>
          ) : null}
        </div>

        <ul>
          {catalogueCategories.map(({ value, label }) => {
            const count = counts[value] ?? 0;
            return (
              <li key={value} className="border-b border-zinc-300">
                <Link
                  href={`/Catalogue?category=${value}&page=1`}
                  className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-5 transition-colors hover:bg-zinc-950 hover:text-white sm:grid-cols-[minmax(0,16rem)_1fr_auto_auto] sm:px-3"
                >
                  <span className={`${display.className} text-3xl font-extrabold italic uppercase sm:text-4xl`}>
                    {label}
                  </span>
                  <span className="order-last col-span-2 text-sm text-zinc-600 group-hover:text-zinc-300 sm:order-none sm:col-span-1 sm:text-base">
                    {categoryHints[value]}
                  </span>
                  <span className="hidden text-sm text-zinc-600 group-hover:text-zinc-300 sm:block">
                    {count > 0 ? `${count} en stock` : ""}
                  </span>
                  <ArrowUpRight
                    className="size-7 text-red-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red-400"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ───────────── ARRIVAGES ───────────── */}
      {latest.length > 0 ? (
        <section className="bg-zinc-950 py-16 text-white lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className={`${heading} text-5xl sm:text-6xl`}>
                  Tout juste démonté
                </h2>
                <p className="mt-3 max-w-md text-zinc-300">
                  Chaque pièce est unique. Quand elle est vendue, elle n&apos;est
                  plus là.
                </p>
              </div>
              <Link
                href="/Catalogue"
                className="inline-flex items-center gap-2 self-start border-b-2 border-red-600 pb-1 font-bold uppercase hover:text-red-400 sm:self-auto"
              >
                Tout le stock <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
              {latest.map((product, index) => {
                const src = imageSrc(product.image);
                return (
                  <li key={product.id}>
                    <Link href={`/Catalogue/${product.id}`} className="group block">
                      <div className="relative aspect-4/5 overflow-hidden bg-zinc-800">
                        {src ? (
                          <Image
                            src={src}
                            alt={product.productName}
                            fill
                            sizes="(max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ImageOff className="size-10 text-zinc-500" aria-hidden="true" />
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3">
                          <PriceTag
                            price={formatPrice(product.price)}
                            className={index % 2 ? "rotate-3" : "-rotate-3"}
                          />
                        </div>
                      </div>
                      <p className="mt-3 text-xs uppercase text-zinc-400">
                        {getCategoryLabel(product.category)}
                        {product.reference ? ` — réf. ${product.reference}` : ""}
                      </p>
                      <h3 className="mt-1 line-clamp-2 font-semibold group-hover:underline">
                        {product.productName}
                      </h3>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ───────────── COMMENT ÇA MARCHE ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-10 lg:py-24">
        <h2 className={`${heading} text-5xl sm:text-6xl`}>
          Comment ça se passe
        </h2>

        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {[
            {
              title: "Vous trouvez la pièce",
              text: "Par nom ou par rayon. Photos réelles et référence d'origine sur chaque fiche.",
            },
            {
              title: "Vous payez en ligne",
              text: "Par carte, paiement sécurisé. La pièce est mise de côté pour vous.",
            },
            {
              title: "Vous passez la chercher",
              text: "Du lundi au vendredi, de 8h à 18h, à Séméac. Le retrait est gratuit.",
            },
          ].map(({ title, text }, index) => (
            <li key={title} className="border-t-4 border-zinc-950 pt-4">
              <span className={`${display.className} text-6xl font-black italic text-red-600`}>
                {index + 1}
              </span>
              <h3 className="mt-2 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-zinc-700">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────────── LE MAGASIN ───────────── */}
      <section className="border-t-2 border-zinc-950 bg-white">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1fr_1.1fr]">
          <div className="relative min-h-[380px] lg:min-h-[560px]">
            <Image
              src="/LockerLoin.webp"
              alt="Le magasin Autoshop 65 à Séméac, vu de la rue"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>

          <div className="px-4 py-14 sm:px-8 lg:px-12 lg:py-20">
            <h2 className={`${heading} text-5xl sm:text-6xl`}>
              Un vrai magasin,
              <br />
              pas un entrepôt.
            </h2>
            <p className="mt-4 max-w-md text-zinc-700">
              Vous récupérez votre pièce au comptoir, on vous la montre, et si
              vous avez une question, quelqu&apos;un vous répond.
            </p>

            <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-bold uppercase text-zinc-500">Adresse</dt>
                <dd className="mt-1 font-semibold">
                  86 av. François Mitterrand
                  <br />
                  65600 Séméac
                </dd>
                <dd>
                  <a
                    href={MAPS_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-red-700 underline underline-offset-4"
                  >
                    Itinéraire
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-bold uppercase text-zinc-500">Horaires</dt>
                <dd className="mt-1 font-semibold">Lundi au vendredi</dd>
                <dd className="font-semibold">8h00 – 18h00</dd>
              </div>
            </dl>

            <div className="mt-8 border-t border-zinc-300 pt-6">
              <p className="text-sm font-bold uppercase text-zinc-500">Aussi sur place</p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-semibold">
                <li>
                  <Link href="/Contact" className="underline-offset-4 hover:text-red-700 hover:underline">
                    Mécanique
                  </Link>
                </li>
                <li>
                  <Link href="/AboutPage" className="underline-offset-4 hover:text-red-700 hover:underline">
                    Station service
                  </Link>
                </li>
                <li>
                  <Link href="/RetraitColis" className="underline-offset-4 hover:text-red-700 hover:underline">
                    Retrait colis
                  </Link>
                </li>
              </ul>
            </div>

            <a
              href={PHONE_HREF}
              className="mt-10 inline-flex items-center gap-3 bg-zinc-950 px-6 py-4 text-white transition-colors hover:bg-red-700"
            >
              <Phone className="size-5" aria-hidden="true" />
              <span className={`${display.className} text-2xl font-extrabold italic uppercase`}>
                {PHONE_DISPLAY}
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
