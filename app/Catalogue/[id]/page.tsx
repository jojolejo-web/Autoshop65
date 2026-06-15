import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle,
  Heart,
  MailIcon,
  MapPin,
  Phone,
  ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/metadata";
import AddToCartAction from "../AddToCartAction";
import { findProductId } from "../action";
import ProductGallery from "./ProductGallery";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const id = Number((await params).id);

  if (Number.isNaN(id)) {
    return { title: "Produit introuvable" };
  }

  const product = await findProductId({ id });

  if (!product) {
    return { title: "Produit introuvable" };
  }

  const image = product.image ? `/${product.image}` : siteConfig.logo;
  const description =
    product.productDescription ??
    `Decouvrez ${product.productName} en piece d'occasion chez Autoshop 65.`;

  return {
    title: product.productName,
    description,
    alternates: {
      canonical: `${siteConfig.url}/Catalogue/${product.id}`,
    },
    openGraph: {
      title: product.productName,
      description,
      url: `${siteConfig.url}/Catalogue/${product.id}`,
      type: "website",
      images: [
        {
          url: image,
          alt: product.productName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.productName,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const id = Number((await params).id);

  if (Number.isNaN(id)) {
    redirect("/Catalogue");
  }

  const product = await findProductId({ id });

  if (!product) {
    redirect("/Catalogue");
  }

  const mainImage = product.image ? `/${product.image}` : null;
  const extraImages = product.images.map((image) => `/${image.src}`);
  const galleryImages = [...(mainImage ? [mainImage] : []), ...extraImages];
  const uniqueImages = [...new Set(galleryImages)];

  return (
    <main className="min-h-screen px-4 py-6 dark:bg-black sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,480px)] lg:gap-10">
        <ProductGallery
          alt={product.productName}
          images={uniqueImages.length ? uniqueImages : ["/placeholder.png"]}
        />

        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold sm:text-3xl">{product.productName}</h1>
            <p className="text-sm text-zinc-600 sm:text-base">
              {product.productDescription}
            </p>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <p className="text-3xl font-medium text-red-600 sm:text-4xl">
              {formatPrice(product.price)}
            </p>
            <p className="text-gray-600">TVA incluse</p>
          </div>

          <Separator />

          <p
            className={`flex items-center gap-2 text-sm sm:text-base ${product.stock >= 1 ? "text-green-600" : "text-red-600"}`}
          >
            <CheckCircle className="size-5 shrink-0 sm:size-6" />
            En stock : {product.stock}
          </p>
          <p className="flex items-center gap-2 text-sm sm:text-base">
            <MapPin className="size-5 shrink-0" />
            Disponible a Tarbes (65000)
          </p>
          <p className="text-sm text-zinc-700 sm:text-base">
            Reference : {product.reference?.trim() || "Non renseignee"}
          </p>

          <Separator />

          <div className="space-y-3">
            <AddToCartAction
              productId={product.id}
              buttonClassName="w-full bg-red-600 py-5 text-white hover:bg-red-700 sm:py-6"
              variant="destructive"
            >
              <ShoppingCart className="mr-2 size-5" />
              Ajouter au panier
            </AddToCartAction>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <Heart className="mr-2 size-4" />
                Favoris
              </Button>
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Acheter maintenant
              </Button>
            </div>
          </div>

          <Card className="mt-10 border-red-100">
            <CardHeader>
              <CardTitle className="text-red-500">Besoin d&apos;information</CardTitle>
              <CardDescription>Notre equipe est a votre disposition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex w-full flex-col gap-3">
                <Button
                  variant="destructive"
                  className="flex w-full justify-start gap-4 border-2 border-zinc-300 bg-transparent py-4 text-left text-sm text-black hover:bg-gray-100 sm:text-base"
                >
                  <Phone />
                  <Link href="tel:0562952175">05 62 95 21 75</Link>
                </Button>
                <Button
                  variant="destructive"
                  className="flex h-auto w-full justify-start gap-4 border-2 border-zinc-300 bg-transparent py-4 text-left text-sm text-black hover:bg-gray-100 sm:text-base"
                >
                  <MailIcon />
                  <Link href="mailto:autoshop65600@hotmail.com">
                    autoshop65600@hotmail.com
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
