import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { navLinks, navLinksFooter } from "./nav-links";

export default function Footer() {
  return (
    <footer className="text-white">
      <div className="bg-gray-800 px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Image
              src="/logoAutoshop65.png"
              height={80}
              width={80}
              alt="Logo Autoshop65"
            />
            <p className="max-w-md text-sm leading-6 text-gray-400 sm:text-base">
              Votre specialiste en pieces d&apos;occasion automobiles de qualite
              dans les Hautes-Pyrenees.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold sm:text-xl">Liens rapides</h2>
            <ol className="space-y-2">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 hover:underline sm:text-base"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold sm:text-xl">Contact</h2>
            <ol className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400 sm:text-base">
                <MapPin className="mt-0.5 shrink-0 text-red-500" />
                <span>86 Av. Francois Mitterrand 65600 Semeac</span>
              </li>
              <li>
                <Link
                  href="tel:0562952175"
                  className="flex items-start gap-3 text-sm text-gray-400 hover:text-red-500 hover:underline sm:text-base"
                >
                  <Phone className="mt-0.5 shrink-0 text-red-500" />
                  <span>05 62 95 21 75</span>
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:autoshop65600@hotmail.com"
                  className="flex items-start gap-3 break-all text-sm text-gray-400 hover:text-red-500 hover:underline sm:text-base"
                >
                  <Mail className="mt-0.5 shrink-0 text-red-500" />
                  <span>autoshop65600@hotmail.com</span>
                </Link>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400 sm:text-base">
                <Clock className="mt-0.5 shrink-0 text-red-500" />
                <span>8h / 18h du lundi au vendredi</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-[#00000c] px-4 py-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-center sm:text-left lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-gray-500">
            © 2026 AUTOSHOP 65. Tous droits reserves.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-end">
            {navLinksFooter.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-gray-400 hover:text-red-500 hover:underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
