import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Car,
  Clock,
  Cog,
  CreditCard,
  Disc3,
  Fuel,
  Gauge,
  ImageOff,
  Lightbulb,
  MapPin,
  Package,
  Phone,
  Recycle,
  Search,
  Store,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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

const PHONE_DISPLAY = "05 62 95 21 75";
const PHONE_HREF = "tel:0562952175";
const ADDRESS = "86 Av. François Mitterrand, 65600 Séméac";
const MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=86+Avenue+Fran%C3%A7ois+Mitterrand+65600+S%C3%A9m%C3%A9ac";

const categoryIcons: Record<CatalogueCategory, LucideIcon> = {
  carroserie: Car,
  moteur: Gauge,
  transmission: Cog,
  eclairage: Lightbulb,
  suspension: Disc3,
};

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
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}

function imageSrc(image: string | null) {
  return image ? `/${image.replace(/^\/+/, "")}` : null;
}

function HazardStripe({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-2 w-full bg-[repeating-linear-gradient(135deg,#dc2626_0_14px,#0a0a0a_14px_28px)] ${className}`}
    />
  );
}

export default async function Home() {
  const { latest, counts, total } = await getHomeData();
  const featured = latest[0];
  const featuredImage = featured ? imageSrc(featured.image) : null;

  return (
    <main className="bg-white">
      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-size-[48px_48px]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-40 -top-40 size-[520px] rounded-full bg-red-600/25 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:px-10 lg:py-24">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-red-300">
              <span className="size-1.5 rounded-full bg-red-500" />
              Pièces d&apos;occasion · Hautes-Pyrénées
            </p>

            <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-7xl">
              La bonne pièce.
              <br />
              <span className="text-red-500">Sans le prix</span> du neuf.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-zinc-300">
              Des pièces auto contrôlées dans notre atelier, jusqu&apos;à 70 %
              moins chères. Payez en ligne, récupérez-les à Séméac.
            </p>

            <form
              action="/Catalogue"
              method="get"
              role="search"
              className="mt-8 flex max-w-xl flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur sm:flex-row"
            >
              <input type="hidden" name="page" value="1" />
              <label htmlFor="home-search" className="sr-only">
                Rechercher une pièce
              </label>
              <div className="flex flex-1 items-center gap-3 rounded-lg bg-white px-4">
                <Search className="size-5 shrink-0 text-zinc-500" aria-hidden="true" />
                <input
                  id="home-search"
                  name="search"
                  type="search"
                  placeholder="Ex : rétroviseur Clio 2, alternateur…"
                  className="h-12 w-full bg-transparent text-base text-zinc-900 outline-none placeholder:text-zinc-500"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 bg-red-600 px-6 text-base font-semibold text-white hover:bg-red-700"
              >
                Rechercher
              </Button>
            </form>

            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Catégories">
              {catalogueCategories.map(({ value, label }) => (
                <li key={value}>
                  <Link
                    href={`/Catalogue?category=${value}&page=1`}
                    className="inline-block rounded-full border border-white/15 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-red-500 hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Étiquette d'atelier : le dernier arrivage */}
          <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:justify-self-end">
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-3 rotate-2 rounded-2xl border border-white/10 bg-zinc-800"
            />
            <div className="relative -rotate-1 overflow-hidden rounded-2xl bg-[#f4efe6] text-zinc-900 shadow-2xl">
              <div className="flex items-center justify-between border-b-2 border-dashed border-zinc-300 px-5 py-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-600">
                  {featured ? "Dernier arrivage" : "Fiche atelier"}
                </span>
                <span
                  aria-hidden="true"
                  className="size-4 rounded-full border-2 border-zinc-400 bg-zinc-950"
                />
              </div>

              <div className="relative aspect-4/3 bg-zinc-200">
                {featuredImage ? (
                  <Image
                    src={featuredImage}
                    alt={featured.productName}
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 384px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Wrench className="size-16 text-zinc-400" aria-hidden="true" />
                  </div>
                )}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded bg-emerald-700 px-2 py-1 text-xs font-bold uppercase text-white">
                  <BadgeCheck className="size-3.5" aria-hidden="true" />
                  Testée
                </span>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 px-5 py-4 font-mono text-sm">
                <div className="col-span-2">
                  <dt className="text-xs uppercase text-zinc-600">Pièce</dt>
                  <dd className="truncate font-sans text-base font-bold">
                    {featured?.productName ?? "Pièce contrôlée avant vente"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-zinc-600">Réf.</dt>
                  <dd className="truncate">{featured?.reference || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-zinc-600">Retrait</dt>
                  <dd>Séméac</dd>
                </div>
              </dl>

              <div className="flex items-center justify-between gap-3 bg-zinc-950 px-5 py-4 text-white">
                <span className="text-2xl font-black">
                  {featured ? formatPrice(featured.price) : "-70 %"}
                </span>
                <Link
                  href={featured ? `/Catalogue/${featured.id}` : "/Catalogue"}
                  className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold hover:bg-red-700"
                >
                  {featured ? "Voir la pièce" : "Voir le stock"}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <HazardStripe />
      </section>

      {/* ───────────── ARGUMENTS ───────────── */}
      <section aria-label="Nos engagements" className="border-b border-zinc-200 bg-zinc-50">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-zinc-200 lg:grid-cols-4">
          {[
            { Icon: BadgeCheck, title: "Pièces testées", text: "Contrôlées avant la mise en vente" },
            { Icon: Store, title: "Retrait gratuit", text: "Au magasin de Séméac" },
            { Icon: CreditCard, title: "Paiement sécurisé", text: "Carte bancaire via Stripe" },
            { Icon: Recycle, title: "Jusqu'à -70 %", text: "Par rapport au prix du neuf" },
          ].map(({ Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3 bg-zinc-50 px-4 py-5 sm:px-6">
              <Icon className="mt-0.5 size-6 shrink-0 text-red-600" aria-hidden="true" />
              <div>
                <p className="font-bold text-zinc-900">{title}</p>
                <p className="text-sm text-zinc-600">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────────── CATÉGORIES ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-sm font-semibold uppercase tracking-widest text-red-700">
              Le stock
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-4xl">
              Trouvez par catégorie
            </h2>
          </div>
          {total > 0 ? (
            <p className="text-zinc-600">
              <span className="font-bold text-zinc-900">{total}</span> pièce
              {total > 1 ? "s" : ""} disponible{total > 1 ? "s" : ""} en ce moment
            </p>
          ) : null}
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {catalogueCategories.map(({ value, label }) => {
            const Icon = categoryIcons[value];
            const count = counts[value] ?? 0;
            return (
              <li key={value}>
                <Link
                  href={`/Catalogue?category=${value}&page=1`}
                  className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white hover:shadow-xl"
                >
                  <div className="mb-6 flex items-start justify-between">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    {count > 0 ? (
                      <span className="font-mono text-sm text-zinc-500 group-hover:text-zinc-300">
                        {count} réf.
                      </span>
                    ) : null}
                  </div>
                  <h3 className="text-lg font-bold">{label}</h3>
                  <p className="mt-1 flex-1 text-sm text-zinc-600 group-hover:text-zinc-300">
                    {categoryHints[value]}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-red-700 group-hover:text-red-400">
                    Explorer
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ───────────── DERNIERS ARRIVAGES ───────────── */}
      {latest.length > 0 ? (
        <section className="bg-zinc-100 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-sm font-semibold uppercase tracking-widest text-red-700">
                  Fraîchement démontées
                </p>
                <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-4xl">
                  Derniers arrivages
                </h2>
                <p className="mt-2 text-zinc-600">
                  Pièces uniques : quand elle est vendue, elle est partie.
                </p>
              </div>
              <Button asChild variant="outline" className="border-zinc-950 bg-transparent">
                <Link href="/Catalogue">
                  Tout le catalogue <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {latest.map((product, index) => {
                const src = imageSrc(product.image);
                return (
                  <li key={product.id}>
                    <Link
                      href={`/Catalogue/${product.id}`}
                      className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg"
                    >
                      <div className="relative aspect-square bg-zinc-200">
                        {src ? (
                          <Image
                            src={src}
                            alt={product.productName}
                            fill
                            sizes="(max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ImageOff className="size-10 text-zinc-400" aria-hidden="true" />
                          </div>
                        )}
                        {index < 3 ? (
                          <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs font-bold uppercase text-white">
                            Nouveau
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
                        <p className="font-mono text-xs uppercase text-zinc-500">
                          {getCategoryLabel(product.category)}
                          {product.reference ? ` · ${product.reference}` : ""}
                        </p>
                        <h3 className="line-clamp-2 flex-1 font-semibold text-zinc-900 group-hover:underline">
                          {product.productName}
                        </h3>
                        <p className="mt-2 text-lg font-black text-zinc-950">
                          {formatPrice(product.price)}
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
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <p className="font-mono text-sm font-semibold uppercase tracking-widest text-red-700">
          Simple et rapide
        </p>
        <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-4xl">
          Comment ça marche
        </h2>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              Icon: Search,
              title: "Trouvez votre pièce",
              text: "Cherchez par nom ou par catégorie, consultez les photos et la référence.",
            },
            {
              Icon: CreditCard,
              title: "Payez en ligne",
              text: "Paiement sécurisé par carte. La pièce vous est réservée immédiatement.",
            },
            {
              Icon: Store,
              title: "Récupérez à Séméac",
              text: "Passez au magasin du lundi au vendredi, de 8h à 18h. Retrait gratuit.",
            },
          ].map(({ Icon, title, text }, index) => (
            <li
              key={title}
              data-step={`0${index + 1}`}
              className="relative overflow-hidden rounded-2xl border border-zinc-200 p-6 before:absolute before:-right-1 before:-top-4 before:font-mono before:text-8xl before:font-black before:text-zinc-100 before:content-[attr(data-step)]"
            >
              <Icon className="relative size-8 text-red-600" aria-hidden="true" />
              <h3 className="relative mt-4 text-xl font-bold">
                <span className="sr-only">Étape {index + 1} : </span>
                {title}
              </h3>
              <p className="relative mt-2 text-zinc-600">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────────── LE MAGASIN ───────────── */}
      <section className="bg-zinc-950 text-white">
        <HazardStripe />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-10 lg:py-20">
          <div>
            <p className="font-mono text-sm font-semibold uppercase tracking-widest text-red-400">
              Autoshop 65
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-4xl">
              Plus qu&apos;une casse en ligne
            </h2>
            <p className="mt-3 max-w-lg text-zinc-300">
              Un vrai magasin, avec une équipe sur place pour vous conseiller.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  Icon: Wrench,
                  title: "Mécanique",
                  text: "Entretien et réparation de votre véhicule.",
                  href: "/Contact",
                  cta: "Prendre RDV",
                },
                {
                  Icon: Fuel,
                  title: "Station service",
                  text: "Faites le plein en passant récupérer votre pièce.",
                  href: "/AboutPage",
                  cta: "En savoir plus",
                },
                {
                  Icon: Package,
                  title: "Retrait colis",
                  text: "Point relais pour vos commandes Cdiscount.",
                  href: "/RetraitColis",
                  cta: "Voir le service",
                },
              ].map(({ Icon, title, text, href, cta }) => (
                <li key={title} className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-5">
                  <Icon className="size-7 text-red-500" aria-hidden="true" />
                  <h3 className="mt-3 font-bold">{title}</h3>
                  <p className="mt-1 flex-1 text-sm text-zinc-300">{text}</p>
                  <Link
                    href={href}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-red-400 hover:text-red-300 hover:underline"
                  >
                    {cta}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-6 text-zinc-900 sm:p-8">
            <h3 className="text-xl font-black uppercase">Venez nous voir</h3>
            <ul className="mt-6 space-y-5">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
                <div>
                  <p className="font-semibold">{ADDRESS}</p>
                  <a
                    href={MAPS_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-red-700 hover:underline"
                  >
                    Itinéraire Google Maps
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Lundi – Vendredi : 8h00 – 18h00</p>
                  <p className="text-sm text-zinc-600">Fermé le samedi et le dimanche</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
                <div>
                  <p className="font-semibold">{PHONE_DISPLAY}</p>
                  <p className="text-sm text-zinc-600">
                    Une question sur une pièce ? Appelez-nous.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button asChild size="lg" className="h-12 bg-red-600 text-white hover:bg-red-700">
                <a href={PHONE_HREF}>
                  <Phone aria-hidden="true" /> Appeler
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 border-zinc-950">
                <Link href="/Catalogue">
                  Voir les pièces <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
