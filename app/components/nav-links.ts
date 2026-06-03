import { AiOutlineInfoCircle, AiOutlineMail } from "react-icons/ai";
import { FiPackage } from "react-icons/fi";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { PiGarage } from "react-icons/pi";

export const navLinks = [
  { label: "Accueil", href: "/", Icon: PiGarage },
  { label: "Piece", href: "/Catalogue", Icon: HiOutlineWrenchScrewdriver },
  { label: "Colis", href: "/RetraitColis", Icon: FiPackage },
  { label: "A propos", href: "/AboutPage", Icon: AiOutlineInfoCircle },
  { label: "Contact", href: "/Contact", Icon: AiOutlineMail },
];
export const navLinksFooter = [
  { label: "Mention légales", href: "/Mention-légales" },
  { label: "Politique de confidentialité", href: "/Pdc" },
  { label: "CGV", href: "/CGV" },
    { label: "Cookies", href: "/Cookies" },

]
