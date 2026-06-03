"use server";

import { hash } from "bcryptjs";
import { prisma } from "../../lib/prisma";

export type SignUpInput = {
  surName: string;
  name: string;
  email: string;
  password: string;
};

export async function createUser(data: SignUpInput) {
  const surName = data.surName.trim();
  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const password = data.password.trim();
  if (!password || !name || !email || !surName) {
    return {
      success: false,
      message: "Tous les champs ne sont pas enregistrés",
    };
  }
  if (password.length < 8) return { success: false, message: "Mot de passe trop court" };
  const Hashpassword = await hash(password, 10);

  if (await prisma.user.findUnique({ where: { email } })) {
    return { success: false, message: "Cet email est deja utilise" };
  }
  try {
    await prisma.user.create({
      data: {
        surName,
        name,
        email,
        password: Hashpassword,
      },
    });
  } catch {
    return { success: false, message: "Une erreur est survenue" };
  }

  return { success: true };
}
