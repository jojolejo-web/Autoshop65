"use server";

import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { createProduct } from "@/app/Catalogue/action";
import { revalidatePath } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY);

type MarkOrderPreparedResult =
  | { success: false; message: string }
  | { success: true; orderId: number };

type DeleteProductResult =
  | { success: false; message: string }
  | { success: true; productId: number };

type UpdateProductResult =
  | { success: false; message: string }
  | {
      success: true;
      product: {
        id: number;
        productName: string;
        reference: string | null;
        productDescription: string | null;
        price: number;
        stock: number;
      };
    };

function formatPrice(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export async function getAdminDashboardData() {
  await requireAdminSession();

  const [
    usersCount,
    ordersCount,
    paidOrdersCount,
    preparedOrdersCount,
    preparationEmailsSentCount,
    activeOrders,
    orderHistory,
    products,
  ] =
    await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "paid" } }),
      prisma.order.count({ where: { isPrepared: true } }),
      prisma.order.count({
        where: {
          preparationEmailSentAt: {
            not: null,
          },
        },
      }),
      prisma.order.findMany({
        where: {
          status: "paid",
          isPrepared: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              email: true,
              name: true,
              surName: true,
            },
          },
          items: {
            orderBy: {
              id: "asc",
            },
            include: {
              product: {
                select: {
                  image: true,
                },
              },
            },
          },
          transactions: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      }),
      prisma.order.findMany({
        where: {
          OR: [{ isPrepared: true }, { status: "cancelled" }, { status: "failed" }],
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 30,
        include: {
          user: {
            select: {
              email: true,
              name: true,
              surName: true,
            },
          },
          items: {
            orderBy: {
              id: "asc",
            },
            include: {
              product: {
                select: {
                  image: true,
                },
              },
            },
          },
          transactions: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      }),
      prisma.product.findMany({
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
          productName: true,
          reference: true,
          productDescription: true,
          price: true,
          stock: true,
          image: true,
          category: true,
          _count: {
            select: {
              orderItems: true,
            },
          },
        },
      }),
    ]);

  return {
    stats: {
      usersCount,
      ordersCount,
      paidOrdersCount,
      preparedOrdersCount,
      preparationEmailsSentCount,
    },
    activeOrders,
    orderHistory,
    products,
  };
}

function renderPreparedOrderEmail(params: {
  customerName: string;
  orderId: number;
  totalAmount: number;
  items: {
    quantity: number;
    unitPrice: number;
    productNameSnapshot: string;
  }[];
}) {
  const { customerName, orderId, totalAmount, items } = params;
  const itemsHtml = items
    .map(
      (item) => `
        <li style="margin-bottom:8px;">
          ${item.productNameSnapshot} x${item.quantity} - ${formatPrice(item.unitPrice * item.quantity)}
        </li>
      `,
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; padding: 24px; color: #18181b;">
      <h1 style="color: #b91c1c; margin-bottom: 16px;">Commande preparee</h1>
      <p>Bonjour ${customerName},</p>
      <p>Votre commande #${orderId} est preparee et finalisee.</p>
      <p style="margin-top: 16px; font-weight: 700;">Pieces commandees :</p>
      <ul style="padding-left: 20px; margin: 8px 0 16px;">
        ${itemsHtml}
      </ul>
      <p style="margin: 0 0 16px;"><strong>Montant paye :</strong> ${formatPrice(totalAmount)}</p>
      <p>Merci pour votre confiance.</p>
      <p style="margin-top: 24px;">Autoshop 65</p>
    </div>
  `;
}

export async function markOrderPrepared(
  orderId: number,
): Promise<MarkOrderPreparedResult> {
  await requireAdminSession();

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return { success: false, message: "Commande invalide" };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          email: true,
          name: true,
          surName: true,
        },
      },
      items: {
        orderBy: {
          id: "asc",
        },
        select: {
          quantity: true,
          unitPrice: true,
          productNameSnapshot: true,
        },
      },
      transactions: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!order) {
    return { success: false, message: "Commande introuvable" };
  }

  if (order.status !== "paid") {
    return {
      success: false,
      message: "La commande doit etre payee avant preparation",
    };
  }

  if (order.isPrepared) {
    return { success: false, message: "Commande deja preparee" };
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM_EMAIL) {
    return { success: false, message: "Email admin non configure" };
  }

  const customerName =
    order.user.surName?.trim() ||
    order.user.name?.trim() ||
    order.user.email.trim();

  const emailResult = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL,
    to: order.user.email,
    subject: `Votre commande #${order.id} est preparee`,
    html: renderPreparedOrderEmail({
      customerName,
      orderId: order.id,
      totalAmount: order.totalAmount,
      items: order.items,
    }),
    text: [
      `Bonjour ${customerName},`,
      "",
      `Votre commande #${order.id} est preparée et finalisée.`,
      "",
      "Pièces commandées :",
      ...order.items.map(
        (item) =>
          `- ${item.productNameSnapshot} x${item.quantity} - ${formatPrice(item.unitPrice * item.quantity)}`,
      ),
      "",
      `Montant payé : ${formatPrice(order.totalAmount)}`,
      "",
      "Merci pour votre confiance.",
      "Autoshop 65",
    ].join("\n"),
  });

  if (emailResult.error) {
    return {
      success: false,
      message: emailResult.error.message ?? "Erreur d'envoi de l'email",
    };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      isPrepared: true,
      preparedAt: new Date(),
      preparationEmailSentAt: new Date(),
    },
  });

  revalidatePath("/Admin");

  return { success: true, orderId: order.id };
}

export async function createProductFromAdmin(formData: FormData) {
  await requireAdminSession();
  await createProduct(formData);
  revalidatePath("/Admin");
}

export async function deleteProductFromAdmin(
  productId: number,
): Promise<DeleteProductResult> {
  await requireAdminSession();

  if (!Number.isInteger(productId) || productId <= 0) {
    return { success: false, message: "Piece invalide" };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      _count: {
        select: {
          orderItems: true,
        },
      },
    },
  });

  if (!product) {
    return { success: false, message: "Piece introuvable" };
  }

  if (product._count.orderItems > 0) {
    return {
      success: false,
      message: "Impossible de supprimer une piece deja liee a des commandes",
    };
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/Admin");
  revalidatePath("/Catalogue");

  return { success: true, productId };
}

export async function updateProductFromAdmin(input: {
  productId: number;
  productName: string;
  reference: string;
  productDescription: string;
  price: number;
  stock: number;
}): Promise<UpdateProductResult> {
  await requireAdminSession();

  const productId = Number(input.productId);
  const productName = String(input.productName ?? "").trim();
  const reference = String(input.reference ?? "").trim();
  const productDescription = String(input.productDescription ?? "").trim();
  const price = Number(input.price);
  const stock = Number(input.stock);

  if (!Number.isInteger(productId) || productId <= 0) {
    return { success: false, message: "Piece invalide" };
  }

  if (!productName) {
    return { success: false, message: "Nom invalide" };
  }

  if (!Number.isInteger(price) || price <= 0) {
    return { success: false, message: "Prix invalide" };
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return { success: false, message: "Stock invalide" };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    return { success: false, message: "Piece introuvable" };
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      productName,
      reference: reference || null,
      productDescription: productDescription || null,
      normalizedName: normalizeText(productName),
      normalizedDescription: normalizeText(productDescription),
      price,
      stock,
    },
    select: {
      id: true,
      productName: true,
      reference: true,
      productDescription: true,
      price: true,
      stock: true,
    },
  });

  revalidatePath("/Admin");
  revalidatePath("/Catalogue");
  revalidatePath(`/Catalogue/${productId}`);

  return { success: true, product: updatedProduct };
}
