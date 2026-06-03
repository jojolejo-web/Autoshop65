import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search } from "lucide-react";
import { countProducts, findProduct } from "./action";
import CategorieCard from "./CategoriesCard";
import { isCatalogueCategory, type CatalogueCategory } from "./categories";
import Product from "./Product";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Catalogue de pieces d'occasion",
  description:
    "Explorez notre catalogue de pieces detachees d'occasion pour moteur, carrosserie, freins et suspension.",
  path: "/Catalogue",
});

type CatalogueProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
  }>;
};

const PRODUCTS_PER_PAGE = 9;

function buildPageHref(
  page: number,
  search: string,
  category?: CatalogueCategory,
) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (category) {
    params.set("category", category);
  }

  params.set("page", String(page));

  return `/Catalogue?${params.toString()}`;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const adjustedStart = Math.max(1, end - 4);

  return Array.from(
    { length: end - adjustedStart + 1 },
    (_, index) => adjustedStart + index,
  );
}

export default async function Catalogue({ searchParams }: CatalogueProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const category = params.category && isCatalogueCategory(params.category)
    ? params.category
    : undefined;
  const requestedPage = Number.parseInt(params.page ?? "1", 10);

  const totalProducts = await countProducts(search, category);
  const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, totalPages)
      : 1;

  const products = await findProduct(
    currentPage,
    PRODUCTS_PER_PAGE,
    search,
    category,
  );
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <main className="min-h-screen bg-white pb-10 dark:bg-black">
      <form
        action="/Catalogue"
        className="bg-linear-to-br from-red-600 to-red-700 px-4 py-10 sm:px-6 lg:px-12 xl:px-20"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <h1 className="text-center text-3xl text-white sm:text-4xl">
            Catalogue de produits
          </h1>

          <div className="relative flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:flex-row lg:items-center">
            <Search className="absolute left-8 top-8 size-4 text-gray-400 lg:top-1/2 lg:-translate-y-1/2" />

            <Input
              name="search"
              defaultValue={search}
              className="w-full bg-gray-100 pl-10"
              placeholder="Rechercher une piece (ex: phare, pare-choc, moteur...)"
            />
            <input type="hidden" name="page" value="1" />
            <Button variant="destructive" type="submit" className="w-full lg:w-auto">
              Rechercher
            </Button>
          </div>
        </div>
      </form>

      <section className="px-4 py-10 sm:px-6 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-medium text-zinc-900 dark:text-white">
                Produits
              </h2>
              <p className="text-sm text-zinc-500">
                {totalProducts} piece{totalProducts > 1 ? "s" : ""} trouvee
                {totalProducts > 1 ? "s" : ""}
              </p>
            </div>
            <p className="text-sm text-zinc-500">
              Page {currentPage} sur {totalPages}
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <CategorieCard currentCategory={category} search={search} />

            <div className="w-full space-y-6">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <Product key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
                  Pas de produits disponible
                </p>
              )}

              {totalProducts > 0 ? (
                <nav className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <Link
                    href={buildPageHref(
                      Math.max(currentPage - 1, 1),
                      search,
                      category,
                    )}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      currentPage === 1
                        ? "pointer-events-none border-zinc-200 text-zinc-300"
                        : "hover:bg-zinc-100"
                    }`}
                  >
                    Precedent
                  </Link>

                  {visiblePages.map((page) => (
                    <Link
                      key={page}
                      href={buildPageHref(page, search, category)}
                      className={`rounded-md border px-4 py-2 text-sm ${
                        currentPage === page
                          ? "border-red-500 bg-red-500 text-white"
                          : "hover:bg-zinc-100"
                      }`}
                    >
                      {page}
                    </Link>
                  ))}

                  <Link
                    href={buildPageHref(
                      Math.min(currentPage + 1, totalPages),
                      search,
                      category,
                    )}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      currentPage === totalPages
                        ? "pointer-events-none border-zinc-200 text-zinc-300"
                        : "hover:bg-zinc-100"
                    }`}
                  >
                    Suivant
                  </Link>
                </nav>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
