import type { Metadata } from "next";

const siteUrl =
  process.env.NEXTAUTH_URL ?? "https://www.station-saint-christophe.fr";

export const siteConfig = {
  name: "Autoshop 65",
  shortName: "Autoshop65",
  title:
    "Autoshop 65 - Station service, mécanique, retrait colis et pièces d'occasion",
  description:
    "Autoshop 65 a Tarbes : station service carburant, mécanique automobile, retrait colis Cdiscount et vente de pièces d'occasion.",
  url: siteUrl,
  logo: "/logoAutoshop65.png",
};

export function buildPageMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const canonical =
    path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
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
      title,
      description,
      images: [siteConfig.logo],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}
