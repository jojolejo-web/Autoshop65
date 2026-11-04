import type { Metadata } from "next";
import Link from "next/link";

import { company } from "@/lib/company";
import { buildPageMetadata } from "@/lib/metadata";
import { LegalPage, LegalSection, LegalTable } from "../components/LegalPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Politique de confidentialité",
  description: `Comment ${company.tradeName} collecte, utilise et protège vos données personnelles.`,
  path: "/politique-de-confidentialite",
});

const processors = [
  { name: "Vercel Inc.", role: "Hébergement du site", location: "États-Unis" },
  { name: "Supabase Inc.", role: "Hébergement de la base de données (compte, commandes, favoris)", location: "Selon la région du projet" },
  { name: "Stripe Payments Europe Ltd.", role: "Paiement par carte bancaire", location: "Irlande / États-Unis" },
  { name: "Resend", role: "Envoi des emails (contact, commande préparée)", location: "États-Unis" },
  { name: "Google LLC", role: "Connexion avec un compte Google (si vous la choisissez)", location: "États-Unis" },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      current="/politique-de-confidentialite"
      intro={
        <p>
          Cette page explique quelles données personnelles nous collectons sur{" "}
          {company.website}, pourquoi, combien de temps nous les gardons et
          comment exercer vos droits, conformément au Règlement général sur la
          protection des données (RGPD) et à la loi Informatique et Libertés.
        </p>
      }
    >
      <LegalSection title="1. Responsable du traitement">
        <p>
          {company.legalName}, {company.legalForm.toLowerCase()} au capital de{" "}
          {company.capital}, {company.address}, {company.rcs}, représentée par{" "}
          {company.director}, {company.directorRole.toLowerCase()}.
        </p>
        <p>
          Contact pour toute question sur vos données :{" "}
          <a href={`mailto:${company.email}`}>{company.email}</a>.
        </p>
      </LegalSection>

      <LegalSection title="2. Données collectées">
        <ul>
          <li>
            <strong>Création de compte</strong> : nom, prénom, adresse email
            et mot de passe. Le mot de passe est enregistré chiffré : personne,
            pas même nous, ne peut le lire.
          </li>
          <li>
            <strong>Connexion avec Google</strong> : votre nom et votre
            adresse email transmis par Google. Nous ne recevons pas votre mot
            de passe Google.
          </li>
          <li>
            <strong>Commandes</strong> : pièces commandées, montants, dates et
            statut de la commande et du paiement.
          </li>
          <li>
            <strong>Paiement</strong> : il est entièrement géré par Stripe. Vos
            numéros de carte bancaire ne transitent pas par nos serveurs et ne
            sont jamais stockés par {company.tradeName}.
          </li>
          <li>
            <strong>Panier et favoris</strong> : les pièces que vous y ajoutez.
          </li>
          <li>
            <strong>Formulaire de contact</strong> : nom, email, téléphone
            (facultatif), objet et message. Le message nous est transmis par
            email ; il n’est pas enregistré dans notre base de données.
          </li>
        </ul>
        <p>
          Nous n’utilisons aucun outil de statistiques ni de publicité, et
          nous ne vendons jamais vos données.
        </p>
      </LegalSection>

      <LegalSection title="3. Pourquoi nous utilisons vos données">
        <ul>
          <li>
            <strong>Gérer votre compte, vos commandes et le retrait en magasin</strong>{" "}
            — base légale : exécution du contrat.
          </li>
          <li>
            <strong>Vous prévenir quand votre commande est prête</strong> —
            base légale : exécution du contrat.
          </li>
          <li>
            <strong>Tenir notre comptabilité</strong> (conservation des
            factures et commandes) — base légale : obligation légale.
          </li>
          <li>
            <strong>Répondre à vos messages</strong> — base légale : notre
            intérêt légitime à vous répondre, ou mesures précontractuelles.
          </li>
          <li>
            <strong>Sécuriser le site et votre compte</strong> (limitation des
            tentatives de mot de passe, déconnexion des sessions après un
            changement de mot de passe) — base légale : intérêt légitime.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Durée de conservation">
        <ul>
          <li>
            <strong>Compte</strong> : jusqu’à sa suppression. Vous pouvez
            le supprimer à tout moment depuis la page « Mon compte ».
          </li>
          <li>
            <strong>Commandes et paiements</strong> : 10 ans, durée imposée
            par le Code de commerce (article L123-22). Si vous supprimez votre
            compte, ces commandes sont conservées sans votre nom ni votre
            email.
          </li>
          <li>
            <strong>Panier et favoris</strong> : jusqu’à ce que vous les
            retiriez ou supprimiez votre compte.
          </li>
          <li>
            <strong>Messages de contact</strong> : le temps de traiter votre
            demande, puis 3 ans au maximum.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Qui reçoit vos données">
        <p>
          Vos données sont réservées à l’équipe {company.tradeName}. Pour
          faire fonctionner le site, nous faisons appel aux prestataires
          suivants, qui agissent uniquement sur nos instructions :
        </p>
        <LegalTable
          headers={["Prestataire", "Rôle", "Localisation"]}
          rows={processors.map(({ name, role, location }) => [name, role, location])}
        />
        <p>
          Lorsque des données sont transférées hors de l’Union
          européenne, ces transferts sont encadrés par le cadre de protection
          des données UE–États-Unis (Data Privacy Framework) ou par les clauses
          contractuelles types de la Commission européenne.
        </p>
      </LegalSection>

      <LegalSection title="6. Sécurité">
        <p>
          Le site est accessible uniquement en connexion chiffrée (HTTPS). Les
          mots de passe sont chiffrés avec un algorithme dédié (bcrypt), les
          tentatives de mot de passe répétées sont bloquées temporairement, et
          toutes vos sessions sont déconnectées lorsque vous changez de mot de
          passe ou supprimez votre compte.
        </p>
      </LegalSection>

      <LegalSection title="7. Vos droits">
        <p>Vous disposez à tout moment des droits suivants sur vos données :</p>
        <ul>
          <li><strong>Accès</strong> : savoir quelles données nous détenons.</li>
          <li>
            <strong>Rectification</strong> : corriger vos nom et prénom
            directement depuis « Mon compte », ou nous écrire pour le reste.
          </li>
          <li>
            <strong>Effacement</strong> : supprimer votre compte depuis « Mon
            compte », sous réserve des données que la loi nous oblige à
            conserver.
          </li>
          <li><strong>Limitation</strong> et <strong>opposition</strong> au traitement.</li>
          <li>
            <strong>Portabilité</strong> : recevoir vos données dans un format
            lisible.
          </li>
          <li>
            <strong>Directives post-mortem</strong> : indiquer ce que nous
            devons faire de vos données après votre décès.
          </li>
        </ul>
        <p>
          Pour exercer ces droits, écrivez-nous à{" "}
          <a href={`mailto:${company.email}`}>{company.email}</a>. Nous
          répondons dans un délai d’un mois. Une pièce d’identité
          peut vous être demandée en cas de doute sur votre identité.
        </p>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez
          adresser une réclamation à la CNIL :{" "}
          <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">
            www.cnil.fr/fr/plaintes
          </a>.
        </p>
      </LegalSection>

      <LegalSection title="8. Cookies">
        <p>
          Le site n’utilise que les cookies indispensables à la connexion
          à votre compte. Le détail est dans notre{" "}
          <Link href="/cookies">politique cookies</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
