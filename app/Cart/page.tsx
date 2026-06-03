import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { confirmCartCheckout, findCart } from "./action";
import CartPage from "./CartPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Panier",
  description: "Consultez votre panier et finalisez votre commande chez Autoshop 65.",
  path: "/Cart",
  noIndex: true,
});

type CartPageProps = {
  searchParams: Promise<{
    checkout?: string;
    session_id?: string;
  }>;
};

export default async function Cart({ searchParams }: CartPageProps) {
  const params = await searchParams;
  let checkoutMessage: string | null = null;

  if (params.checkout === "success" && params.session_id) {
    const result = await confirmCartCheckout(params.session_id);
    checkoutMessage = result.message;
  }

  if (params.checkout === "cancel") {
    checkoutMessage = "Paiement annule";
  }

  const cart = await findCart();

  return <CartPage cart={cart} checkoutMessage={checkoutMessage} />;
}
