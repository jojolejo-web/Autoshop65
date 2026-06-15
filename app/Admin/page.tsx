import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import AdminInterface from "./AdminInterface";
import { getAdminDashboardData } from "./action";

export const metadata: Metadata = buildPageMetadata({
  title: "Administration",
  description: "Espace administration Autoshop 65.",
  path: "/Admin",
  noIndex: true,
});

export default async function AdminPage() {
  const data = await getAdminDashboardData();

  return (
    <AdminInterface
      stats={data.stats}
      products={data.products.map((product) => ({
        id: product.id,
        productName: product.productName,
        reference: product.reference,
        productDescription: product.productDescription,
        price: product.price,
        stock: product.stock,
        image: product.image,
        category: product.category,
        usedInOrdersCount: product._count.orderItems,
      }))}
      activeOrders={data.activeOrders.map((order) => ({
        id: order.id,
        status: order.status,
        isPrepared: order.isPrepared,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt.toISOString(),
        preparedAt: order.preparedAt ? order.preparedAt.toISOString() : null,
        user: {
          email: order.user.email,
          name: order.user.name,
          surName: order.user.surName,
        },
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
            }
          : null,
      }))}
      orderHistory={data.orderHistory.map((order) => ({
        id: order.id,
        status: order.status,
        isPrepared: order.isPrepared,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt.toISOString(),
        preparedAt: order.preparedAt ? order.preparedAt.toISOString() : null,
        user: {
          email: order.user.email,
          name: order.user.name,
          surName: order.user.surName,
        },
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
            }
          : null,
      }))}
    />
  );
}
