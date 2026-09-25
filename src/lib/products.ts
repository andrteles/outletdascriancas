import raw from "@/data/products.json";

export interface Product {
  handle: string;
  slug: string;
  title: string;
  description: string | null;
  brand: string;
  price: number;
  compareAtPrice: number | null;
  discountPercent: number | null;
  images: string[];
  sizes: string[];
  category: string;
  ageGroup: "Bebê" | "Infantil";
  tags: string[];
}

export const products = raw as Product[];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, limit);
}

export const categories = Array.from(new Set(products.map((p) => p.category))).sort();

export const ageGroups = ["Bebê", "Infantil"] as const;

export type SortOption = "relevancia" | "menor-preco" | "maior-preco" | "maior-desconto";

export interface ProductFilters {
  categoria?: string | undefined;
  faixa?: string | undefined;
  busca?: string | undefined;
  ordenar?: SortOption | undefined;
}

export function filterProducts(filters: ProductFilters): Product[] {
  let list = [...products];

  if (filters.categoria) {
    list = list.filter((p) => p.category === filters.categoria);
  }
  if (filters.faixa) {
    list = list.filter((p) => p.ageGroup === filters.faixa);
  }
  if (filters.busca) {
    const query = filters.busca.toLowerCase();
    list = list.filter((p) => p.title.toLowerCase().includes(query));
  }

  switch (filters.ordenar) {
    case "menor-preco":
      list.sort((a, b) => a.price - b.price);
      break;
    case "maior-preco":
      list.sort((a, b) => b.price - a.price);
      break;
    case "maior-desconto":
      list.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
      break;
    default:
      list.sort((a, b) => sortPriority(a) - sortPriority(b));
      break;
  }

  return list;
}

function sortPriority(product: Product): number {
  if (product.title.toLowerCase().includes("caixa")) return 2;
  if (product.category === "Acessórios") return 1;
  return 0;
}
