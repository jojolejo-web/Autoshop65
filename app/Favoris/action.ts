"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ToggleFavoriteResult =
  | { success: true; isFavorite: boolean }
  | { success: false; message: string; requiresLogin?: boolean };

export async function toggleFavorite(
  productId: number,
): Promise<ToggleFavoriteResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      success: false,
      requiresLogin: true,
      message: "Connectez-vous pour ajouter des favoris",
    };
  }

  if (!Number.isInteger(productId) || productId <= 0) {
    return { success: false, message: "Produit invalide" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return {
      success: false,
      requiresLogin: true,
      message: "Connectez-vous pour ajouter des favoris",
    };
  }

  const existing = await prisma.favori.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.favori.delete({ where: { id: existing.id } });
  } else {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return { success: false, message: "Produit introuvable" };
    }

    // upsert : pas d'erreur si deux clics arrivent en même temps.
    await prisma.favori.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      create: { userId: user.id, productId },
      update: {},
    });
  }

  // Met à jour le compteur de la barre de navigation et la page Favoris.
  revalidatePath("/", "layout");

  return { success: true, isFavorite: !existing };
}
