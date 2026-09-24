import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import { ProductCard } from "@/components/store/ProductCard";
import { filterProducts, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  pagina: z.coerce.number().int().positive().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Outlet das Crianças · Roupas Carter's com até 60% OFF" },
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

// Destaques manuais: troca 2 calças (cores repetidas) da 2ª fila da home
// por um kit e um conjunto de ticket mais alto.
const DESTAQUES_SLUGS = [
  "kit-body-bebe-5-pecas-trenzinhos-multicor-carter-s",
  "conjunto-longo-bebe-3-pecas-ovelinha-off-white-carter-s",
];
const SUBSTITUIDOS_SLUGS = [
  "calca-jeans-infantil-baggy-coracoes-denim-escuro-carter-s",
  "calca-jeans-infantil-reta-com-cos-elastico-denim-escuro-carter-s",
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
    const destaques = DESTAQUES_SLUGS.map((slug) => all.find((p) => p.slug === slug)).filter(
      (p): p is Product => Boolean(p),
    );
    const posicao = vitrine.findIndex((p) => p.slug === SUBSTITUIDOS_SLUGS[0]);
    vitrine = vitrine.filter(
      (p) => !SUBSTITUIDOS_SLUGS.includes(p.slug) && !DESTAQUES_SLUGS.includes(p.slug),
    );
    vitrine.splice(posicao === -1 ? vitrine.length : posicao, 0, ...destaques);
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

      <div className="mt-8 flex items-center justify-center gap-3">
        <Link
          to="/"
          search={{ pagina: page - 1 }}
          aria-disabled={page <= 1}
          className={cn(
            "rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors",
            page <= 1
              ? "pointer-events-none opacity-40"
              : "hover:border-primary hover:text-primary",
          )}
        >
          Anterior
        </Link>
        <p className="text-sm text-muted-foreground">
          Página {page} de {totalPages}
        </p>
        <Link
          to="/"
          search={{ pagina: page + 1 }}
          aria-disabled={page >= totalPages}
          className={cn(
            "rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors",
            page >= totalPages
              ? "pointer-events-none opacity-40"
              : "hover:border-primary hover:text-primary",
          )}
        >
          Próxima
        </Link>
      </div>
    </div>
  );
}
