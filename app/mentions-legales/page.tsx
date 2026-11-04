import type { Metadata } from "next";
import Link from "next/link";

import { company } from "@/lib/company";
import { buildPageMetadata } from "@/lib/metadata";
import { LegalFacts, LegalPage, LegalSection } from "../components/LegalPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Mentions légales",
  description: `Mentions légales du site ${company.tradeName} : éditeur, hébergeur et informations juridiques.`,
  path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      current="/mentions-legales"
      intro={
        <p>
          Conformément à l’article 6 de la loi n° 2004-575 du 21 juin 2004
          pour la confiance dans l’économie numérique, voici les
          informations relatives à l’éditeur et à l’hébergeur du
          site {company.website}.
        </p>
      }
    >
      <LegalSection title="Éditeur du site">
        <LegalFacts
          rows={[
            ["Raison sociale", company.legalName],
            ["Nom commercial", company.tradeName],
            ["Forme juridique", company.legalForm],
            ["Capital social", company.capital],
            ["Siège social", company.address],
            ["SIREN", company.siren],
            ["SIRET (siège)", company.siret],
            ["Immatriculation", company.rcs],
            ["N° de TVA intracommunautaire", company.vat],
            ["Activité (NAF/APE)", company.naf],
            ["Téléphone", <a key="tel" href={company.phoneHref}>{company.phoneDisplay}</a>],
            ["Email", <a key="mail" href={`mailto:${company.email}`}>{company.email}</a>],
          ]}
        />
      </LegalSection>

      <LegalSection title="Directeur de la publication">
        <p>
          {company.director}, en qualité de {company.directorRole.toLowerCase()}{" "}
          de la société {company.legalName}.
        </p>
      </LegalSection>

      <LegalSection title="Hébergeur">
        <LegalFacts
          rows={[
            ["Société", company.host.name],
            ["Adresse", company.host.address],
            ["Site", <a key="host" href={company.host.website} target="_blank" rel="noopener noreferrer">{company.host.website.replace("https://", "")}</a>],
          ]}
        />
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          L’ensemble des contenus du site (textes, photographies des
          pièces, logo, mise en page) est la propriété de {company.legalName},
          sauf mention contraire. Toute reproduction, représentation ou
          diffusion, totale ou partielle, sans autorisation écrite préalable
          est interdite et peut constituer une contrefaçon (articles L335-2 et
          suivants du Code de la propriété intellectuelle).
        </p>
        <p>
          Les noms et marques des constructeurs automobiles cités sur le site
          servent uniquement à identifier la compatibilité des pièces. Ils
          appartiennent à leurs propriétaires respectifs.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilité">
        <p>
          {company.legalName} s’efforce de fournir des informations
          exactes et à jour (descriptions, références, prix, disponibilités).
          Des erreurs ou omissions peuvent toutefois survenir : en cas de
          doute sur la compatibilité d’une pièce, contactez-nous avant
          votre achat.
        </p>
        <p>
          Le site peut contenir des liens vers des sites tiers (par exemple
          Google Maps ou le service de paiement). {company.legalName} n’a
          pas de contrôle sur ces sites et décline toute responsabilité quant
          à leur contenu.
        </p>
      </LegalSection>

      <LegalSection title="Données personnelles et cookies">
        <p>
          Le traitement de vos données est décrit dans notre{" "}
          <Link href="/politique-de-confidentialite">politique de confidentialité</Link>{" "}
          et l’usage des cookies dans notre{" "}
          <Link href="/cookies">politique cookies</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Droit applicable">
        <p>
          Les présentes mentions légales sont soumises au droit français. Les
          conditions de vente sont détaillées dans nos{" "}
          <Link href="/cgv">conditions générales de vente</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
