/**
 * Informations légales de la société, utilisées par les pages légales et le
 * site. Une seule source à mettre à jour.
 */
export const company = {
  tradeName: "Autoshop 65",
  legalName: "AUTO SHOP 65",
  legalForm: "Société à responsabilité limitée (SARL)",
  capital: "500 €",
  address: "86 avenue François Mitterrand, 65600 Séméac, France",
  siren: "984 660 373",
  siret: "984 660 373 00015",
  rcs: "RCS Tarbes 984 660 373",
  vat: "FR70984660373",
  naf: "45.20A – Entretien et réparation de véhicules automobiles légers",
  director: "Yannis GROSSET",
  directorRole: "Gérant",
  email: "autoshop65600@hotmail.com",
  phoneDisplay: "05 62 95 21 75",
  phoneHref: "tel:0562952175",
  openingHours: "du lundi au vendredi, de 8h à 18h",
  website: "www.station-saint-christophe.fr",

  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis",
    website: "https://vercel.com",
  },

  /**
   * Médiateur de la consommation : OBLIGATOIRE pour vendre à des particuliers
   * (art. L612-1 du Code de la consommation). Renseigner le nom, l'adresse et
   * le site du médiateur auquel la société adhère.
   */
  mediator: null as null | { name: string; address: string; website: string },
} as const;

export const LEGAL_LAST_UPDATE = "4 novembre 2026";
