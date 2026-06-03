import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, X } from "lucide-react";

import CheckoutButton from "./CheckoutButton";
import CartQuantitySelect from "./CartQuantitySelect";
import { deleteToCart } from "./action";

type CartProps = {
  cart: CartType | null;
  checkoutMessage?: string | null;
};

type CartType = {
  id: number;
  items: CartItemType[];
};

type CartItemType = {
  id: number;
  quantity: number;
  product: ProductType;
};

type ProductType = {
  id: number;
  productName: string;
  productDescription: string | null;
  price: number;
  stock: number;
  image: string | null;
};

export default function CartPage({ cart, checkoutMessage }: CartProps) {
  if (!cart) {
    return (
      <main className="min-h-screen px-4 py-10 dark:bg-black md:px-10 xl:px-20 2xl:px-50">
        {checkoutMessage ? (
          <div className="fixed top-4 left-1/2 z-10 -translate-x-1/2 rounded-md bg-white px-4 py-3 text-sm shadow">
            {checkoutMessage}
          </div>
        ) : null}

        <Card className="mx-auto max-w-3xl">
          <CardContent className="p-8">
            <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
              Votre panier est vide
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const totalPrice = cart.items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  return (
    <main className="min-h-screen bg-white px-4 py-6 pb-32 dark:bg-black md:px-10 xl:px-20 2xl:px-50">
      {checkoutMessage ? (
        <div className="fixed top-4 left-1/2 z-10 -translate-x-1/2 rounded-md bg-white px-4 py-3 text-sm shadow">
          {checkoutMessage}
        </div>
      ) : null}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <Card className="w-full">
          {cart.items.length > 0 ? (
            cart.items.map((item) => {
              const deleteItemAction = deleteToCart.bind(null, item.id);

              return (
                <CardContent key={item.id} className="space-y-3 p-4 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row  md:justify-between">
                    <div className="flex gap-3">
                      <img
                        src={item.product.image || ""}
                        alt={item.product.productName}
                        className="h-24 w-24 rounded-md object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {item.product.productName}
                          </CardTitle>
                          <form action={deleteItemAction} className="sm:hidden block">
                            <Button
                              className="border-none p-0 hover:bg-transparent "
                              variant="outline"
                            >
                              <X />
                            </Button>
                          </form>
                        </div>

                        <CardDescription>
                          {item.product.productDescription}
                        </CardDescription>
                        <CardDescription>Ref :</CardDescription>
                        <CardDescription>
                          <Button
                            variant="outline"
                            className="h-auto border-0 p-0 hover:bg-transparent"
                          >
                            <Heart /> Ajouter a la liste de souhait
                          </Button>
                        </CardDescription>
                      </div>
                    </div>

                    <div className="grid gap-3 md:min-w-56">
                      <CartQuantitySelect
                        cartItemId={item.id}
                        initialQuantity={item.quantity}
                        stock={item.product.stock}
                      />

                      <div className="flex  justify-between ">
                        <p className="text-xl font-medium">
                          {((item.product.price * item.quantity) / 100)
                            .toFixed(2)
                            .replace(".", ",")}{" "}
                          EUR
                        </p>
                      </div>
                    </div>
                    <form action={deleteItemAction} className="md:block hidden">
                      <Button
                        className="border-none p-0 hover:bg-transparent "
                        variant="outline"
                      >
                        <X />
                      </Button>
                    </form>
                  </div>
                  <Separator />
                </CardContent>
              );
            })
          ) : (
            <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
              Votre panier est vide
            </p>
          )}
        </Card>

        <Card className="hidden min-w-sm xl:block xl:w-90">
          <CardContent className="space-y-4 p-6">
            <CardTitle className="text-xl">Votre commande:</CardTitle>
            <Separator />
            <div className="flex justify-between">
              <p>Prix total de la marchandise</p>
              <p>{(totalPrice / 100).toFixed(2).replace(".", ",")} EUR</p>
            </div>
            <Separator />
            <div className="flex justify-between gap-4">
              <CardTitle>Total de la commande</CardTitle>
              <div className="text-right">
                <CardTitle className="text-xl font-bold">
                  <p>{(totalPrice / 100).toFixed(2).replace(".", ",")} EUR</p>
                </CardTitle>
                <CardDescription>
                  <p>20 % de TVA incluse</p>
                </CardDescription>
              </div>
            </div>
            <CheckoutButton disabled={cart.items.length === 0} />
          </CardContent>
        </Card>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur xl:hidden">
        <div className="mx-auto max-w-3xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Total</p>
              <p className="text-xl font-semibold text-zinc-900">
                {(totalPrice / 100).toFixed(2).replace(".", ",")} EUR
              </p>
            </div>
            <p className="text-xs text-zinc-500">20 % de TVA incluse</p>
          </div>
          <CheckoutButton disabled={cart.items.length === 0} />
        </div>
      </div>
    </main>
  );
}
