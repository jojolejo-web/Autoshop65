import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { getServerSession } from "next-auth";

import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/auth";
import { siteConfig } from "@/lib/metadata";

import Navbar from "./components/Navbar";
import SessionProvider from "./SessionProvider";
import Footer from "./components/Footer";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "station service",
    "carburant",
    "mecanique auto",
    "retrait colis",
    "Cdiscount",
    "pieces d'occasion",
    "Tarbes",
    "garage",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  icons: {
    icon: [{ url: siteConfig.logo, type: "image/png" }],
    shortcut: [siteConfig.logo],
    apple: [{ url: siteConfig.logo, type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: siteConfig.logo,
        width: 512,
        height: 512,
        alt: `${siteConfig.name} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.logo],
  },
};

export default async  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
      let cartItemsCount = 0;
       if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cart: {
          include: {
            items: true,
          },
        },
      },
    });
  
    cartItemsCount =
      user?.cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
  }
  


  return (
    <html
      lang="fr"
      className={cn("h-full", "antialiased", "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <Navbar  cartItemsCount={cartItemsCount}/>
          {children}
          <Footer/>
        </SessionProvider>
      </body>
    </html>
  );
}
