import { createFileRoute, Link } from "@tanstack/react-router";

import { ProductCard } from "@/components/store/ProductCard";
import { filterProducts } from "@/lib/products";

export const Route = createFileRoute("/")({
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

const filtros = [
  { rotulo: "Promoções", search: { ordenar: "maior-desconto" as const } },
  { rotulo: "Bebê", search: { faixa: "Bebê" } },
  { rotulo: "Infantil", search: { faixa: "Infantil" } },
  { rotulo: "Kits", search: { categoria: "Kits" } },
  { rotulo: "Conjuntos", search: { categoria: "Conjuntos" } },
  { rotulo: "Pijamas", search: { categoria: "Pijamas" } },
];

function Home() {
  const vitrine = filterProducts({ ordenar: "maior-desconto" }).slice(0, 16);

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

      <div className="mt-6 text-center">
        <Link
          to="/produtos"
          className="inline-block rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Ver todos os produtos
        </Link>
      </div>
    </div>
  );
}
