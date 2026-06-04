export const catalogueCategories = [
  { value: "carroserie", label: "Carroserie" },
  { value: "moteur", label: "Moteur" },
  { value: "transmission", label: "Transmission" },
  { value: "eclairage", label: "Eclairage" },
  { value: "suspension", label: "Suspension" },
] as const;

export type CatalogueCategory = (typeof catalogueCategories)[number]["value"];

export function isCatalogueCategory(value: string): value is CatalogueCategory {
  return catalogueCategories.some((category) => category.value === value);
}

export function getCategoryLabel(value: CatalogueCategory) {
  return (
    catalogueCategories.find((category) => category.value === value)?.label ??
    value
  );
}
