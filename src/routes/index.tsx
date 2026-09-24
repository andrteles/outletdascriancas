import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import { ProductCard } from "@/components/store/ProductCard";
import { getPageNumbers } from "@/lib/pagination";
import { filterProducts } from "@/lib/products";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  pagina: z.coerce.number().int().positive().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Outlet" },
      {
        name: "description",
        content:
          "Roupas infantis Carter's para bebês e crianças com até 60% de desconto. Kits, conjuntos, macacões e mais, do recém-nascido aos 12 anos.",
      },
    ],
  }),
  component: Home,
});

const PAGE_SIZE = 20;

// Destaques manuais da home: cada par troca, no lugar exato do produto
// substituído, um item de ticket mais alto / menos repetido na vitrine.
const SUBSTITUICOES_PAGINA_1: Array<[substituido: string, destaque: string]> = [
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

const filtros = [
  { rotulo: "Promoções", search: { ordenar: "maior-desconto" as const } },
  { rotulo: "Bebê", search: { faixa: "Bebê" } },
  { rotulo: "Infantil", search: { faixa: "Infantil" } },
  { rotulo: "Kits", search: { categoria: "Kits" } },
  { rotulo: "Conjuntos", search: { categoria: "Conjuntos" } },
  { rotulo: "Pijamas", search: { categoria: "Pijamas" } },
];

function Home() {
  const search = Route.useSearch();
  const all = filterProducts({ ordenar: "maior-desconto" });
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const page = Math.min(Math.max(search.pagina ?? 1, 1), totalPages);
  let vitrine = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (page === 1) {
    const porSlug = new Map(all.map((p) => [p.slug, p]));
    const destaqueSlugs = new Set(SUBSTITUICOES_PAGINA_1.map(([, destaque]) => destaque));
    vitrine = vitrine.filter((p) => !destaqueSlugs.has(p.slug));
    for (const [substituido, destaque] of SUBSTITUICOES_PAGINA_1) {
      const indice = vitrine.findIndex((p) => p.slug === substituido);
      const produto = porSlug.get(destaque);
      if (indice !== -1 && produto) {
        vitrine[indice] = produto;
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filtros.map((filtro) => (
          <Link
            key={filtro.rotulo}
            to="/produtos"
            search={filtro.search}
            className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {filtro.rotulo}
          </Link>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
        {vitrine.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      {totalPages > 1 ? (
        <nav
          aria-label="Paginação"
          className="mt-8 flex flex-wrap items-center justify-center gap-1 text-sm"
        >
          <Link
            to="/"
            search={{ pagina: page - 1 }}
            aria-disabled={page <= 1}
            className={cn(
              "rounded-md px-3 py-1.5 font-medium transition-colors",
              page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-secondary",
            )}
          >
            Anterior
          </Link>
          {getPageNumbers(page, totalPages).map((p, index) =>
            p === "..." ? (
              <span key={`ellipsis-${index}`} className="px-1.5 text-muted-foreground">
                …
              </span>
            ) : (
              <Link
                key={p}
                to="/"
                search={{ pagina: p }}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full font-medium hover:bg-secondary",
                  p === page &&
                    "border-2 border-primary font-bold text-primary hover:bg-transparent",
                )}
              >
                {p}
              </Link>
            ),
          )}
          <Link
            to="/"
            search={{ pagina: page + 1 }}
            aria-disabled={page >= totalPages}
            className={cn(
              "rounded-md px-3 py-1.5 font-medium transition-colors",
              page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-secondary",
            )}
          >
            Próxima
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
