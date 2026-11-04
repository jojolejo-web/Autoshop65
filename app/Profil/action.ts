"use server";

import { compare, hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";
import {
  buildDeletedEmail,
  clearAttempts,
  getLockMinutes,
  recordFailedAttempt,
  validateNewPassword,
} from "@/lib/account-security";
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

type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ChangePasswordResult =
  | { success: false; message: string }
  | { success: true };

export async function changePassword(
  data: ChangePasswordInput,
): Promise<ChangePasswordResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, message: "Non autorise" };
  }

  // Même traitement qu'à l'inscription et à la connexion.
  const currentPassword = String(data.currentPassword ?? "").trim();
  const newPassword = String(data.newPassword ?? "").trim();
  const confirmPassword = String(data.confirmPassword ?? "").trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "Tous les champs sont obligatoires" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, password: true },
  });

  if (!user) {
    return { success: false, message: "Non autorise" };
  }

  if (!user.password) {
    return {
      success: false,
      message:
        "Votre compte utilise la connexion Google : le mot de passe se gère depuis votre compte Google.",
    };
  }

  const limiterKey = `password:${user.id}`;
  const lockMinutes = getLockMinutes(limiterKey);

  if (lockMinutes > 0) {
    return {
      success: false,
      message: `Trop de tentatives. Réessayez dans ${lockMinutes} min.`,
    };
  }

  if (!(await compare(currentPassword, user.password))) {
    recordFailedAttempt(limiterKey);
    return { success: false, message: "Mot de passe actuel incorrect" };
  }

  clearAttempts(limiterKey);

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: "Les deux nouveaux mots de passe ne correspondent pas",
    };
  }

  const validationError = validateNewPassword(newPassword);

  if (validationError) {
    return { success: false, message: validationError };
  }

  if (await compare(newPassword, user.password)) {
    return {
      success: false,
      message: "Le nouveau mot de passe doit être différent de l'actuel",
    };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await hash(newPassword, 12) },
  });

  // Le changement d'empreinte révoque toutes les sessions, y compris celle-ci :
  // l'interface reconnecte l'utilisateur avec son nouveau mot de passe.
  return { success: true };
}

export async function deleteAccount(data: {
  password?: string;
  confirmation?: string;
}): Promise<DeleteAccountResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, message: "Non autorise" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      password: true,
      orders: {
        select: { status: true, isPrepared: true },
      },
    },
  });

  if (!user) {
    return { success: false, message: "Non autorise" };
  }

  const limiterKey = `delete:${user.id}`;
  const lockMinutes = getLockMinutes(limiterKey);

  if (lockMinutes > 0) {
    return {
      success: false,
      message: `Trop de tentatives. Réessayez dans ${lockMinutes} min.`,
    };
  }

  if (user.password) {
    const password = String(data.password ?? "").trim();

    if (!password) {
      return { success: false, message: "Mot de passe requis" };
    }

    if (!(await compare(password, user.password))) {
      recordFailedAttempt(limiterKey);
      return { success: false, message: "Mot de passe incorrect" };
    }
  } else if (String(data.confirmation ?? "").trim().toUpperCase() !== "SUPPRIMER") {
    // Compte Google : pas de mot de passe, on demande une confirmation écrite.
    return {
      success: false,
      message: 'Écrivez SUPPRIMER pour confirmer',
    };
  }

  clearAttempts(limiterKey);

  const hasOrderToCollect = user.orders.some(
    (order) => order.status === "paid" && !order.isPrepared,
  );

  if (hasOrderToCollect) {
    return {
      success: false,
      message:
        "Vous avez une commande payée en cours de préparation. Récupérez-la ou contactez-nous avant de supprimer votre compte.",
    };
  }

  const hasOrders = user.orders.length > 0;

  await prisma.$transaction(async (tx) => {
    await tx.post.deleteMany({ where: { authorId: user.id } });
    await tx.favori.deleteMany({ where: { userId: user.id } });
    await tx.cart.deleteMany({ where: { userId: user.id } });

    if (hasOrders) {
      // Les commandes et paiements doivent être conservés (obligations
      // comptables) : on efface toutes les données personnelles du compte.
      await tx.user.update({
        where: { id: user.id },
        data: {
          email: buildDeletedEmail(user.id),
          name: null,
          surName: null,
          password: null,
        },
      });
    } else {
      await tx.user.delete({ where: { id: user.id } });
    }
  });

  return { success: true };
}
