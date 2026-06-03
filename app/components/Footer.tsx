import Image from "next/image";
import { navLinks, navLinksFooter } from "./nav-links";
import Link from "next/link";
import { Clock, Hourglass, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="text-white">
      <div className="grid md:grid-cols-4 bg-gray-800 p-18 ">
        <div className="flex flex-col gap-4">
          <Image
            src="/logoAutoshop65.png"
            height={80}
            width={80}
            alt="Logo Autoshop65"
          />
          <p className="text-gray-400">
            Votre spécialiste en pièces d'occasion automobiles de qualité dans
            les Hautes-Pyrénées.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl">Liens rapides</h2>
          <ol className="space-y-2">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2 hover:underline hover:text-red-500 text-gray-400 `}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl">Contact</h2>
          <ol className="space-y-4">
            <li className="flex items-center gap-2 text-gray-400">
              <MapPin color="red" />
              86 Av. François Mitterrand 65600 Séméac
            </li>
            <li>
              <Link
                href="tel:0562952175"
                className={`flex items-center gap-2 hover:underline hover:text-red-500 text-gray-400 `}
              >
                <Phone color="red" /> 05 62 95 21 75
              </Link>
            </li>
            <li>
              <Link
                href="mailto:autoshop65600@hotmail.com"
                className={`flex items-center gap-2 hover:underline hover:text-red-500 text-gray-400 `}
              >
                <Mail color="red" /> autoshop65600@hotmail.com
              </Link>
            </li>
            <li className={`flex items-center gap-2   text-gray-400 `}>
              <Clock color="red" /> 8h / 18h du lundi au vendredi
            </li>
          </ol>
        </div>
      </div>
      <div className="bg-[#00000c] flex items-center justify-between py-4 px-18">
        <p className="text-sm text-gray-500">
          {" "}
          © 2026 AUTOSHOP 65. Tous droits réservés.
        </p>
        <div className="flex gap-4">
          {navLinksFooter.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 hover:underline hover:text-red-500 text-gray-400 `}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
