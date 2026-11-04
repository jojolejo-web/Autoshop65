import type { Metadata } from "next";
import Link from "next/link";

import { company } from "@/lib/company";
import { buildPageMetadata } from "@/lib/metadata";
import { LegalPage, LegalSection } from "../components/LegalPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Conditions générales de vente",
  description: `Conditions générales de vente des pièces auto d'occasion ${company.tradeName} : commande, paiement, retrait en magasin, rétractation et garanties.`,
  path: "/cgv",
});

export default function CgvPage() {
  const mediator = company.mediator;

  return (
    <LegalPage
      title="Conditions générales de vente"
      current="/cgv"
      intro={
        <p>
          Les présentes conditions générales de vente (CGV) s’appliquent
          à toute commande passée sur le site {company.website} auprès de{" "}
          {company.legalName}, {company.legalForm.toLowerCase()} au capital de{" "}
          {company.capital}, {company.address}, {company.rcs}, TVA{" "}
          {company.vat}. En validant une commande, vous acceptez ces CGV.
        </p>
      }
    >
      <LegalSection title="1. Produits">
        <p>
          {company.tradeName} vend des pièces automobiles d’occasion,
          démontées et contrôlées avant leur mise en vente. Chaque fiche
          présente des photos réelles de la pièce vendue, sa référence lorsque
          celle-ci est connue et son prix.
        </p>
        <p>
          S’agissant de pièces d’occasion, elles peuvent présenter
          des traces d’usage normales qui n’affectent pas leur
          fonctionnement. Chaque pièce est généralement disponible en un seul
          exemplaire.
        </p>
        <p>
          Il vous appartient de vérifier la compatibilité de la pièce avec
          votre véhicule (référence, modèle, motorisation). En cas de doute,
          appelez-nous au{" "}
          <a href={company.phoneHref}>{company.phoneDisplay}</a> avant de
          commander. Nous recommandons de faire monter les pièces par un
          professionnel.
        </p>
      </LegalSection>

      <LegalSection title="2. Prix">
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises (TTC). Le
          retrait en magasin est gratuit : aucun frais de livraison ne
          s’ajoute au prix affiché. Le prix applicable est celui affiché
          au moment de la validation de la commande.
        </p>
      </LegalSection>

      <LegalSection title="3. Commande">
        <p>
          Pour commander, vous devez disposer d’un compte client. Vous
          ajoutez les pièces à votre panier, vérifiez son contenu puis validez
          le paiement. La commande est ferme une fois le paiement accepté ;
          elle apparaît alors dans « Mon compte », rubrique « Mes commandes ».
        </p>
        <p>
          Si une pièce s’avère indisponible après votre paiement (pièce
          unique vendue au même moment en magasin, défaut constaté lors de la
          préparation), nous vous prévenons et vous remboursons intégralement
          dans les meilleurs délais.
        </p>
      </LegalSection>

      <LegalSection title="4. Paiement">
        <p>
          Le paiement s’effectue en ligne par carte bancaire, via la
          plateforme sécurisée Stripe. {company.tradeName} n’a jamais
          accès à vos numéros de carte.
        </p>
      </LegalSection>

      <LegalSection title="5. Retrait en magasin">
        <p>
          Les commandes sont à retirer exclusivement au magasin :{" "}
          <strong>{company.address}</strong>, {company.openingHours}. Aucune
          livraison n’est proposée.
        </p>
        <p>
          Vous recevez un email lorsque votre commande est prête. Présentez-vous
          au comptoir avec votre numéro de commande. Nous vous invitons à
          vérifier la pièce au moment du retrait.
        </p>
      </LegalSection>

      <LegalSection title="6. Droit de rétractation">
        <p>
          Votre commande étant passée à distance, vous disposez d’un délai
          de <strong>14 jours</strong> à compter du retrait de la pièce pour
          exercer votre droit de rétractation, sans avoir à vous justifier
          (articles L221-18 et suivants du Code de la consommation).
        </p>
        <p>
          Pour l’exercer, informez-nous de votre décision par email à{" "}
          <a href={`mailto:${company.email}`}>{company.email}</a> ou par une
          déclaration claire, en précisant votre numéro de commande. Vous
          pouvez aussi utiliser le modèle de formulaire ci-dessous.
        </p>
        <p>
          Rapportez ensuite la pièce au magasin, ou renvoyez-la à vos frais,
          dans les 14 jours suivant votre demande, dans l’état où vous
          l’avez reçue. Une pièce montée, démontée ou endommagée après le
          retrait peut voir son remboursement réduit en proportion de la
          dépréciation constatée.
        </p>
        <p>
          Nous vous remboursons dans les 14 jours suivant votre demande, avec
          le même moyen de paiement que celui utilisé pour la commande. Nous
          pouvons différer le remboursement jusqu’à la récupération de la
          pièce.
        </p>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm">
          <p className="font-semibold text-zinc-950">Modèle de formulaire de rétractation</p>
          <p className="mt-2">
            À l’attention de {company.legalName}, {company.address},{" "}
            {company.email} :<br />
            Je vous notifie par la présente ma rétractation du contrat portant
            sur la vente de la pièce ci-dessous :<br />
            — Commande n° : …<br />
            — Retirée le : …<br />
            — Nom du client : …<br />
            — Date et signature (si envoi papier) : …
          </p>
        </div>
      </LegalSection>

      <LegalSection title="7. Garanties légales">
        <p>
          Toutes les pièces, même d’occasion, bénéficient des garanties
          prévues par la loi lorsque vous achetez en tant que particulier :
        </p>
        <ul>
          <li>
            <strong>Garantie légale de conformité</strong> (articles L217-3 et
            suivants du Code de la consommation) : vous disposez de 2 ans à
            compter du retrait pour agir si la pièce n’est pas conforme.
            Pour un bien d’occasion, le défaut est présumé exister au
            moment de la vente s’il apparaît dans les 12 mois. Vous
            pouvez demander la réparation ou le remplacement de la pièce, ou à
            défaut une réduction du prix ou son remboursement.
          </li>
          <li>
            <strong>Garantie des vices cachés</strong> (articles 1641 à 1649
            du Code civil) : vous disposez de 2 ans à compter de la découverte
            du vice pour agir.
          </li>
        </ul>
        <p>
          Pour faire jouer une garantie, contactez-nous au{" "}
          <a href={company.phoneHref}>{company.phoneDisplay}</a> ou à{" "}
          <a href={`mailto:${company.email}`}>{company.email}</a> en précisant
          votre numéro de commande.
        </p>
      </LegalSection>

      <LegalSection title="8. Données personnelles">
        <p>
          Les données nécessaires à votre commande sont traitées conformément à
          notre{" "}
          <Link href="/politique-de-confidentialite">politique de confidentialité</Link>.
        </p>
      </LegalSection>

      <LegalSection title="9. Réclamations et médiation">
        <p>
          Pour toute réclamation, contactez-nous en priorité : nous cherchons
          toujours une solution amiable.
        </p>
        {mediator ? (
          <p>
            En cas de litige non résolu, vous pouvez recourir gratuitement au
            médiateur de la consommation : <strong>{mediator.name}</strong>,{" "}
            {mediator.address},{" "}
            <a href={mediator.website} target="_blank" rel="noopener noreferrer">
              {mediator.website.replace(/^https?:\/\//, "")}
            </a>
            .
          </p>
        ) : (
          <p>
            En cas de litige non résolu, vous pouvez recourir gratuitement à un
            médiateur de la consommation (articles L611-1 et suivants du Code
            de la consommation). Ses coordonnées vous sont communiquées sur
            simple demande.
          </p>
        )}
      </LegalSection>

      <LegalSection title="10. Droit applicable">
        <p>
          Les présentes CGV sont soumises au droit français. À défaut de
          solution amiable, le litige sera porté devant les tribunaux
          compétents dans les conditions prévues par la loi.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
