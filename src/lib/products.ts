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
  /** Tamanho -> variantId da Zedy, preenchido por scripts/sync-zedy-products.mjs */
  zedyVariantIds?: Partial<Record<string, string>>;
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
    default:
      list.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
      break;
  }

  return list;
}

// Destaques manuais da vitrine: cada par troca, no lugar exato do produto
// substituído, um item de ticket mais alto / menos repetido na listagem.
export const SHOWCASE_SUBSTITUTIONS: Array<[substituido: string, destaque: string]> = [
  [
    "calca-jeans-infantil-baggy-coracoes-denim-escuro-carter-s",
    "kit-body-bebe-5-pecas-trenzinhos-multicor-carter-s",
  ],
  [
    "calca-jeans-infantil-reta-com-cos-elastico-denim-escuro-carter-s",
    "conjunto-longo-bebe-3-pecas-ovelinha-off-white-carter-s",
  ],
  [
    "calca-infantil-relaxed-em-plush-off-white-carter-s",
    "conjunto-longo-bebe-3-pecas-em-sherpa-multicor-carter-s",
  ],
  [
    "calca-de-moletom-infantil-jogger-bege-carter-s",
    "conjunto-longo-bebe-3-pecas-atoalhados-patinho-off-white-carter-s",
  ],
  [
    "calca-de-moletom-infantil-jogger-lilas-carter-s",
    "conjunto-longo-bebe-3-pecas-atoalhados-ratinho-rosa-carter-s",
  ],
];

export function applyShowcaseSubstitutions(list: Product[]): Product[] {
  const porSlug = new Map(list.map((p) => [p.slug, p]));
  const destaqueSlugs = new Set(SHOWCASE_SUBSTITUTIONS.map(([, destaque]) => destaque));
  const result = list.filter((p) => !destaqueSlugs.has(p.slug));
  for (const [substituido, destaque] of SHOWCASE_SUBSTITUTIONS) {
    const indice = result.findIndex((p) => p.slug === substituido);
    const produto = porSlug.get(destaque);
    if (indice !== -1 && produto) {
      result[indice] = produto;
    }
  }
  return result;
}
