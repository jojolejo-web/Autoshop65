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
import { addToCart } from "./action";
import AddToCartAction from "./AddToCartAction";

type ProductProps = {
  product: {
    id: number;
    productName: string;
    productDescription: string | null;
    price: number;
    stock: number;
    image: string | null;
  };
};
export default function Product({ product }: ProductProps) {
  const addToCartWithId = addToCart.bind(null, product.id);

  return (
    <main>
      <Card className="pt-0 ring-0 rounded-none">
        <Link href={`/Catalogue/${product.id}`}>
          <img
            src={
              product.image
                ? `/${product.image.replace(/^\/+/, "")}`
                : "/placeholder.png"
            }
            alt="Image du produit"
            className="z-20 object-cover"
          />
          <CardHeader className="space-y-2 pt-2 hover:underline hover:cursor-pointer">
            <CardTitle>{product.productName}</CardTitle>
            <CardDescription>{product.productDescription}</CardDescription>
          </CardHeader>
        </Link>

        <CardFooter className="flex w-full gap-3">
          <Button variant={"outline"}>
            <Heart />
          </Button>
          <AddToCartAction
            action={addToCartWithId}
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
