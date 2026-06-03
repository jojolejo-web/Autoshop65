"use server";

import { compare } from "bcryptjs";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";
import { prisma } from "../../lib/prisma";

type UpdateProfileInput = {
  name?: string;
  surName?: string;
  email?: string;
};

type UpdateProfileResult =
  | { success: false; message: string }
  | { success: true; user: { name: string | null; surName: string | null } };

type DeleteAccountResult =
  | { success: false; message: string }
  | { success: true };

export async function findUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/LogIn");
  }

  const email = session.user.email;

  if (!email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      orders: {
        where: {
          status: {
            not: "pending",
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
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
      },
    },
  });

  return user;
}

export async function updateProfile(
  data: UpdateProfileInput,
): Promise<UpdateProfileResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, message: "Non autorise" };
  }

  const nextName = typeof data.name === "string" ? data.name.trim() : undefined;
  const nextSurName =
    typeof data.surName === "string" ? data.surName.trim() : undefined;

  if (nextName !== undefined && (nextName.length < 2 || nextName.length > 30)) {
    return {
      success: false,
      message: "Le nom doit contenir entre 2 et 30 caracteres",
    };
  }

  if (
    nextSurName !== undefined &&
    (nextSurName.length < 2 || nextSurName.length > 30)
  ) {
    return {
      success: false,
      message: "Le prenom doit contenir entre 2 et 30 caracteres",
    };
  }

  if (nextName === undefined && nextSurName === undefined) {
    return { success: false, message: "Aucune modification a enregistrer" };
  }

  const user = await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      name: nextName,
      surName: nextSurName,
    },
    select: {
      name: true,
      surName: true,
    },
  });

  return { success: true, user };
}

export async function deleteAccount(
  password: string,
): Promise<DeleteAccountResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, message: "Non autorise" };
  }

  const nextPassword = password.trim();

  if (!nextPassword) {
    return { success: false, message: "Mot de passe requis" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user || !user.password) {
    return { success: false, message: "Utilisateur introuvable" };
  }

  const passwordMatches = await compare(nextPassword, user.password);

  if (!passwordMatches) {
    return { success: false, message: "Mot de passe incorrect" };
  }

  await prisma.user.delete({
    where: { id: user.id },
  });

  return { success: true };
}
