import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { findProductId } from "../action";
import AddToCartAction from "../AddToCartAction";
import ProductGallery from "./ProductGallery";
import { Separator } from "@/components/ui/separator";
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
import Link from "next/link";
import { siteConfig } from "@/lib/metadata";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

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
  const idConvert = (await params).id;
  const id = Number(idConvert);

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
    <main className="min-h-screen px-32 py-8 dark:bg-black">
      {/* <ProductImageForm action={addProductImageWithId} /> */}

      <div className="grid items-start  gap-10 md:grid-cols-2">
        <ProductGallery
          alt={product.productName}
          images={uniqueImages.length ? uniqueImages : ["/placeholder.png"]}
        />
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold">{product.productName}</h1>
          <p className="text-zinc-600">{product.productDescription}</p>
          <Separator />
          <div className="flex flex-col gap-2">
            <p className="text-4xl font-medium text-red-600">
              {(product.price / 100).toFixed(2).replace(".", ",")} €
            </p>
            <p className="text-gray-600">TVA incluse</p>
          </div>

          <Separator />
          <p
            className={`flex items-center gap-2 ${product.stock >= 1 ? "text-green-500" : "text-red-500"} `}
          >
            {" "}
            <CheckCircle className="size-8 mb-2" />
            En stock : {product.stock}
          </p>
          <p className="flex items-center gap-2">
            <MapPin /> Disponible à Tarbes (65000)
          </p>
          <p>Référence :</p>
          <Separator />
          <div className="space-y-3">
            <AddToCartAction
              productId={product.id}
              buttonClassName="w-full bg-red-600 hover:bg-red-700 text-white py-6"
              variant="destructive"
            >
                <ShoppingCart className="mr-2 size-5" />
                Ajouter au panier
            </AddToCartAction>
            <div className="grid grid-cols-2 gap-3">
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
          <Card className="ring-red-500 mt-18">
            <CardHeader>
              <CardTitle className="text-red-500">
                Besoin d&apos;information
              </CardTitle>
              <CardDescription>
                Notre équipe est à votre disposition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full flex flex-col gap-3">
                <Button
                  variant="destructive"
                  className="w-full flex justify-start gap-4 text-md bg-transparent border-2 text-black border-gray hover:bg-gray-100 py-4"
                >
                  <Phone /> <Link href="tel:0562952175">05 62 95 21 75</Link>
                </Button>
                <Button
                  variant="destructive"
                  className="w-full flex justify-start gap-4 text-md bg-transparent border-2 text-black border-gray hover:bg-gray-100  py-4"
                >
                  <MailIcon />{" "}
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
