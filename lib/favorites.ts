import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

/** Ids des produits en favoris pour l'utilisateur connecté (vide sinon). */
export async function getFavoriteProductIds(): Promise<Set<number>> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return new Set();
  }

  const favoris = await prisma.favori.findMany({
    where: { user: { email } },
    select: { productId: true },
  });

  return new Set(favoris.map((favori) => favori.productId));
}
