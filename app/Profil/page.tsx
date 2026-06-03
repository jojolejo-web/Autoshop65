import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";

import { findUser } from "./action";
import ProfilInterface from "./ProfilInterface";

export default async function ProfilPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/LogIn");
  }
  const user = await findUser();
  
  if (!user) {
    redirect("/LogIn");
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialTab =
    resolvedSearchParams?.tab === "commande" ? "commande" : "account";

  return (
    <ProfilInterface
      initialTab={initialTab}
      user={{
        email: user.email,
        name: user.name,
        surName: user.surName,
        orders: user.orders.map((order) => ({
          id: order.id,
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt.toISOString(),
          items: order.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            productNameSnapshot: item.productNameSnapshot,
            image: item.product.image,
          })),
          transaction: order.transactions[0]
            ? {
                id: order.transactions[0].id,
                status: order.transactions[0].status,
                provider: order.transactions[0].provider,
                amount: order.transactions[0].amount,
                currency: order.transactions[0].currency,
              }
            : null,
        })),
      }}
    />
  );
}
