import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AddToCartAction from "./AddToCartAction";

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
};
export default function Product({ product }: ProductProps) {
  return (
    <main>
      <Card className="pt-0 ring-0 rounded-none">
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
          </CardHeader>
        </Link>

        <CardFooter className="flex w-full gap-3">
          <Button variant={"outline"} data-name={`catalogue-favorite-button-${product.id}`}>
            <Heart />
          </Button>
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
    </main>
  );
}
