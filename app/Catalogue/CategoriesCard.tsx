import Link from "next/link";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import {
  catalogueCategories,
  getCategoryLabel,
  type CatalogueCategory,
} from "./categories";

type CategorieCardProps = {
  currentCategory?: CatalogueCategory;
  search: string;
};

function buildCategoryHref(category: CatalogueCategory | null, search: string) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (category) {
    params.set("category", category);
  }

  params.set("page", "1");

  return `/Catalogue?${params.toString()}`;
}

export default function CategorieCard({
  currentCategory,
  search,
}: CategorieCardProps) {
  return (
    <Card className="w-full border-red-100 lg:sticky lg:top-24 lg:w-64">
      <CardHeader className="space-y-4">
        <CardTitle className="mb-2">Categorie</CardTitle>

        <div className="flex flex-col gap-2">
          <Link
            href={buildCategoryHref(null, search)}
            data-name="catalogue-category-all"
            className={`rounded-md border px-4 py-2 text-sm transition-colors ${
              !currentCategory
                ? "border-red-500 bg-red-500 text-white"
                : "border-red-100 bg-white text-zinc-700 hover:bg-red-50"
            }`}
          >
            Toutes les categories
          </Link>

          {catalogueCategories.map((category) => (
            <Link
              key={category.value}
              href={buildCategoryHref(category.value, search)}
              data-name={`catalogue-category-${category.value}`}
              className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                currentCategory === category.value
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-red-100 bg-white text-zinc-700 hover:bg-red-50"
              }`}
            >
              {getCategoryLabel(category.value)}
            </Link>
          ))}
        </div>
      </CardHeader>
    </Card>
  );
}
