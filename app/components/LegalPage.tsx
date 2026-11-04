import Link from "next/link";
import type { ReactNode } from "react";

import { LEGAL_LAST_UPDATE } from "@/lib/company";

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-de-confidentialite", label: "Confidentialité" },
  { href: "/cgv", label: "CGV" },
  { href: "/cookies", label: "Cookies" },
];

export function LegalPage({
  title,
  intro,
  current,
  children,
}: {
  title: string;
  intro?: ReactNode;
  current: string;
  children: ReactNode;
}) {
  return (
    <main className="flex-1 bg-zinc-50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <nav aria-label="Pages légales" className="mb-8">
          <ul className="flex flex-wrap gap-2 text-sm">
            {legalLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={href === current ? "page" : undefined}
                  className={
                    href === current
                      ? "rounded-full bg-zinc-950 px-3 py-1.5 text-white"
                      : "rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-zinc-700 hover:border-zinc-950"
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 sm:p-10">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Dernière mise à jour : {LEGAL_LAST_UPDATE}
          </p>
          {intro ? <div className="mt-6 text-zinc-700">{intro}</div> : null}
          <div className="mt-8 space-y-10">{children}</div>
        </article>
      </div>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-zinc-700 [&_a]:font-medium [&_a]:text-red-700 [&_a]:underline [&>ul:not([data-plain])>li]:ml-5 [&>ul:not([data-plain])>li]:list-disc [&_strong]:text-zinc-950">
        {children}
      </div>
    </section>
  );
}

/** Tableau « libellé : valeur » pour les identités légales. */
export function LegalFacts({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="grid gap-x-6 gap-y-2 rounded-lg bg-zinc-50 p-4 text-sm sm:grid-cols-[auto_1fr]">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="font-medium text-zinc-500">{label}</dt>
          <dd className="text-zinc-950">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Tableau lisible partout : cartes empilées sur mobile, tableau à partir de sm. */
export function LegalTable({
  headers,
  rows,
}: {
  headers: [string, string, string];
  rows: [ReactNode, ReactNode, ReactNode][];
}) {
  return (
    <>
      <ul data-plain="" className="space-y-3 sm:hidden">
        {rows.map((row, index) => (
          <li key={index} className="rounded-lg bg-zinc-50 p-3 text-sm">
            <p className="font-medium text-zinc-950">{row[0]}</p>
            <p className="mt-1">
              <span className="text-zinc-500">{headers[1]} : </span>
              {row[1]}
            </p>
            <p>
              <span className="text-zinc-500">{headers[2]} : </span>
              {row[2]}
            </p>
          </li>
        ))}
      </ul>
      <table className="hidden w-full text-left text-sm sm:table">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500">
            {headers.map((header) => (
              <th key={header} scope="col" className="py-2 pr-4 font-medium last:pr-0">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-zinc-100">
              <td className="py-2 pr-4 font-medium text-zinc-950">{row[0]}</td>
              <td className="py-2 pr-4">{row[1]}</td>
              <td className="py-2">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
