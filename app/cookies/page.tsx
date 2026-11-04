import type { Metadata } from "next";
import Link from "next/link";

import { company } from "@/lib/company";
import { buildPageMetadata } from "@/lib/metadata";
import { LegalPage, LegalSection, LegalTable } from "../components/LegalPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Politique cookies",
  description: `Les cookies utilisés sur le site ${company.tradeName}.`,
  path: "/cookies",
});

const cookies = [
  {
    name: "next-auth.session-token",
    purpose: "Vous garder connecté à votre compte",
    duration: "30 jours",
  },
  {
    name: "next-auth.csrf-token",
    purpose: "Protéger les formulaires de connexion contre les attaques",
    duration: "Session du navigateur",
  },
  {
    name: "next-auth.callback-url",
    purpose: "Vous ramener sur la bonne page après connexion",
    duration: "Session du navigateur",
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      title="Politique cookies"
      current="/cookies"
      intro={
        <p>
          Un cookie est un petit fichier enregistré par votre navigateur.
          Bonne nouvelle : {company.tradeName} n’utilise{" "}
          <strong>aucun cookie publicitaire ni de mesure d’audience</strong>.
          C’est pourquoi nous ne vous affichons pas de bandeau de
          consentement.
        </p>
      }
    >
      <LegalSection title="Cookies utilisés">
        <p>
          Seuls des cookies strictement nécessaires au fonctionnement du site
          sont déposés, uniquement lorsque vous vous connectez à votre compte.
          Ils sont dispensés de consentement (article 82 de la loi
          Informatique et Libertés).
        </p>
        <LegalTable
          headers={["Cookie", "Utilité", "Durée"]}
          rows={cookies.map(({ name, purpose, duration }) => [
            <code key={name} className="font-mono text-xs">{name}</code>,
            purpose,
            duration,
          ])}
        />
        <p className="text-sm text-zinc-500">
          Sur la connexion sécurisée, ces noms peuvent être précédés de
          « __Secure- » ou « __Host- ».
        </p>
      </LegalSection>

      <LegalSection title="Services tiers">
        <p>
          Lors du paiement, vous êtes redirigé vers la page sécurisée de
          Stripe, et lors d’une connexion avec Google, vers la page de
          Google. Ces services déposent leurs propres cookies, nécessaires à la
          sécurité du paiement ou de la connexion, selon leurs politiques
          respectives. Le lien « Itinéraire » ouvre Google Maps dans un nouvel
          onglet ; aucune carte Google n’est intégrée à notre site.
        </p>
      </LegalSection>

      <LegalSection title="Gérer les cookies">
        <p>
          Vous pouvez supprimer ou bloquer les cookies depuis les réglages de
          votre navigateur. Si vous bloquez les cookies nécessaires, vous ne
          pourrez plus vous connecter à votre compte ni passer commande.
        </p>
        <p>
          Pour en savoir plus sur vos données, consultez notre{" "}
          <Link href="/politique-de-confidentialite">politique de confidentialité</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
