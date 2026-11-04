import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AddToCartAction from "./AddToCartAction";
import FavoriteButton from "../components/FavoriteButton";

type ProductProps = {
  product: {
    id: number;
    productName: string;
    reference: string | null;
    productDescription: string | null;
    price: number;
    stock: number;
    image: string | null;
  };
  isFavorite?: boolean;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}

export default function Product({ product, isFavorite = false }: ProductProps) {
  return (
    <article>
      <Card className="rounded-none pt-0 ring-0">
        <Link href={`/Catalogue/${product.id}`} data-name={`catalogue-product-link-${product.id}`}>
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={
                product.image
                  ? `/${product.image.replace(/^\/+/, "")}`
                  : "/placeholder.png"
              }
              alt="Image du produit"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="z-20 object-cover"
            />
          </div>
          <CardHeader className="space-y-2 pt-2 hover:underline hover:cursor-pointer">
            <CardTitle>{product.productName}</CardTitle>
            <CardDescription>{product.productDescription}</CardDescription>
            <p className="text-lg font-semibold text-red-600">{formatPrice(product.price)}</p>
          </CardHeader>
        </Link>

        <CardFooter className="flex w-full gap-3">
          <FavoriteButton productId={product.id} initialIsFavorite={isFavorite} />
          <AddToCartAction
            productId={product.id}
            dataName={`catalogue-add-to-cart-${product.id}`}
            className="flex-1"
            buttonClassName="w-full"
            variant="destructive"
          >
            <ShoppingCart />
            Ajouter au panier
          </AddToCartAction>
        </CardFooter>
      </Card>
    </article>
  );
}
