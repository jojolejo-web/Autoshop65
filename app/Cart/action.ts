"use server";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function findCart() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/LogIn");
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  return cart;
}

export async function confirmCartCheckout(sessionId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/LogIn");
  }

  if (!sessionId) {
    return { success: false, message: null as string | null };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  if (checkoutSession.metadata?.userId !== String(user.id)) {
    return {
      success: false,
      message: "Session de paiement invalide",
    };
  }

  if (checkoutSession.payment_status !== "paid") {
    return {
      success: false,
      message: "Paiement non confirme",
    };
  }

  const orderId = Number(checkoutSession.metadata?.orderId);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return {
      success: false,
      message: "Commande Stripe invalide",
    };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true, userId: true },
  });

  if (!order || order.userId !== user.id) {
    return {
      success: false,
      message: "Commande introuvable",
    };
  }

  if (order.status !== "paid") {
    return {
      success: false,
      message: "Paiement en cours de confirmation",
    };
  }

  return {
    success: true,
    message: "Paiement confirme",
  };
}

export async function updateCartItemQuantity(
  cartItemId: number,
  quantity: number,
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/LogIn");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantite invalide");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: {
      cart: true,
      product: {
        select: {
          stock: true,
        },
      },
    },
  });

  if (!cartItem || cartItem.cart.userId !== user.id) {
    throw new Error("Article panier introuvable");
  }

  if (quantity > cartItem.product.stock) {
    throw new Error("Quantite superieure au stock disponible");
  }

  const updatedCartItem = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  revalidatePath("/Cart");

  return updatedCartItem;
}

export async function deleteToCart(cartItemId: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/LogIn");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    throw new Error("Utilisateur introuvable");
  }
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: {
      cart: true,
    },
  });

  if (!cartItem || cartItem.cart.userId !== user.id) {
    throw new Error("Article panier introuvable");
  }

  const deleteCart = await prisma.cartItem.delete({
    where: {
      id: cartItemId,
    },
  });

  revalidatePath("/Cart");

  return deleteCart;
}
