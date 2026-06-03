import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

function getRequiredEnv(name: "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password?.trim();

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }
        const isValidatePassword = await compare(password, user.password);

        if (!isValidatePassword) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: user.name ?? undefined,
        };
      },
    }),
    GoogleProvider({
      clientId: getRequiredEnv("GOOGLE_CLIENT_ID"),
      clientSecret: getRequiredEnv("GOOGLE_CLIENT_SECRET"),
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/LogIn",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) {
        return true;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name ?? null,
          },
        });
      }

      return true;
    },
  },
};
