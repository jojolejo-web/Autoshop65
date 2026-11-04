import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Heart, ImageOff, ShoppingCart } from "lucide-react";

import { authOptions } from "@/auth";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { buildPageMetadata } from "@/lib/metadata";
import FavoriteButton from "../components/FavoriteButton";
import AddToCartAction from "../Catalogue/AddToCartAction";

export const metadata: Metadata = buildPageMetadata({
  title: "Mes favoris",
  description: "Retrouvez les pièces d'occasion que vous avez mises de côté.",
  path: "/Favoris",
  noIndex: true,
});

function formatPrice(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}

function imageSrc(image: string | null) {
  return image ? `/${image.replace(/^\/+/, "")}` : null;
}

export default async function FavorisPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/LogIn?callbackUrl=%2FFavoris");
  }

  const favoris = await prisma.favori.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      product: {
        select: {
          id: true,
          productName: true,
          reference: true,
          price: true,
          stock: true,
          image: true,
        },
      },
    },
  });

  return (
    <main className="flex-1 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Mes favoris</h1>
          <p className="mt-2 text-zinc-600">
            {favoris.length > 0
              ? `${favoris.length} pièce${favoris.length > 1 ? "s" : ""} mise${favoris.length > 1 ? "s" : ""} de côté. Les pièces d'occasion sont uniques : ne tardez pas trop.`
              : "Retrouvez ici les pièces que vous avez mises de côté."}
          </p>
        </div>

        {favoris.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
            <Heart className="mx-auto size-10 text-zinc-300" aria-hidden="true" />
            <p className="mt-4 font-medium">Vous n&apos;avez pas encore de favoris</p>
            <p className="mt-1 text-sm text-zinc-600">
              Cliquez sur le cœur d&apos;une pièce pour la retrouver ici.
            </p>
            <Button asChild className="mt-6 bg-red-600 text-white hover:bg-red-700">
              <Link href="/Catalogue">Parcourir le catalogue</Link>
            </Button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoris.map(({ id, product }) => {
              const src = imageSrc(product.image);
              const inStock = product.stock > 0;
              return (
                <li
                  key={id}
                  className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200"
                >
                  <Link href={`/Catalogue/${product.id}`} className="group">
                    <div className="relative aspect-square bg-zinc-100">
                      {src ? (
                        <Image
                          src={src}
                          alt={product.productName}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                          className={inStock ? "object-cover" : "object-cover opacity-50 grayscale"}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageOff className="size-8 text-zinc-400" aria-hidden="true" />
                        </div>
                      )}
                      {!inStock ? (
                        <span className="absolute left-3 top-3 rounded bg-zinc-900 px-2 py-1 text-xs font-semibold text-white">
                          Vendue
                        </span>
                      ) : null}
                    </div>
                    <div className="p-4 pb-2">
                      {product.reference ? (
                        <p className="text-xs text-zinc-500">Réf. {product.reference}</p>
                      ) : null}
                      <h2 className="mt-1 line-clamp-2 font-medium group-hover:underline">
                        {product.productName}
                      </h2>
                      <p className="mt-2 text-xl font-bold text-red-700">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>

                  <div className="mt-auto flex gap-2 p-4 pt-2">
                    <FavoriteButton productId={product.id} initialIsFavorite />
                    {inStock ? (
                      <AddToCartAction
                        productId={product.id}
                        className="flex-1"
                        buttonClassName="w-full bg-red-600 text-white hover:bg-red-700"
                      >
                        <ShoppingCart aria-hidden="true" />
                        Ajouter au panier
                      </AddToCartAction>
                    ) : (
                      <p className="flex flex-1 items-center text-sm text-zinc-600">
                        Cette pièce n&apos;est plus disponible
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
