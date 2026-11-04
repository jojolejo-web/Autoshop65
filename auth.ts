import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";
import { passwordFingerprint } from "@/lib/account-security";
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
    /**
     * À chaque lecture de session, on vérifie que le compte existe toujours et
     * que le mot de passe n'a pas changé depuis la connexion. Sinon la session
     * est révoquée (next-auth efface le cookie quand ce callback lève une erreur).
     */
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;

      if (!email) {
        return token;
      }

      let dbUser: { password: string | null } | null;

      try {
        dbUser = await prisma.user.findUnique({
          where: { email },
          select: { password: true },
        });
      } catch (error) {
        // Base injoignable un instant : on ne déconnecte pas tout le monde.
        console.error("Session check skipped", error);
        return token;
      }

      if (!dbUser) {
        throw new Error("Session revoquee : compte introuvable");
      }

      const fingerprint = passwordFingerprint(dbUser.password);

      if (user) {
        token.pwd = fingerprint;
        return token;
      }

      // Jetons émis avant cette mise à jour : on les adopte une fois.
      if (token.pwd === undefined) {
        token.pwd = fingerprint;
        return token;
      }

      if (token.pwd !== fingerprint) {
        throw new Error("Session revoquee : mot de passe modifie");
      }

      return token;
    },
  },
};
