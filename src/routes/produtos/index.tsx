import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { ProductCard } from "@/components/store/ProductCard";
import { ageGroups, categories, filterProducts, type SortOption } from "@/lib/products";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  categoria: z.string().optional(),
  faixa: z.string().optional(),
  busca: z.string().optional(),
  ordenar: z.enum(["relevancia", "menor-preco", "maior-preco", "maior-desconto"]).optional(),
});

export const Route = createFileRoute("/produtos/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Outlet" },
      {
        name: "description",
        content: "Todas as roupas Carter's em promoção, filtre por idade, categoria e preço.",
      },
    ],
  }),
  component: ProductsPage,
});

const sortLabels: Record<SortOption, string> = {
  relevancia: "Relevância",
  "menor-preco": "Menor preço",
  "maior-preco": "Maior preço",
  "maior-desconto": "Maior desconto",
};

function ProductsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const results = filterProducts(search);

  function updateSearch(patch: Partial<typeof search>) {
    navigate({ search: { ...search, ...patch } });
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight font-display">
          {search.busca ? `Resultados para "${search.busca}"` : "Todos os produtos"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{results.length} produtos encontrados</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
        <aside className="flex flex-col gap-6">
          <div>
            <p className="mb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
              Faixa etária
            </p>
            <div className="flex flex-col gap-1 text-sm">
              <button
                type="button"
                onClick={() => updateSearch({ faixa: undefined })}
                className={cn(
                  "rounded-md px-2 py-1.5 text-left hover:bg-secondary",
                  !search.faixa && "bg-secondary font-semibold",
                )}
              >
                Todas
              </button>
              {ageGroups.map((faixa) => (
                <button
                  key={faixa}
                  type="button"
                  onClick={() => updateSearch({ faixa })}
                  className={cn(
                    "rounded-md px-2 py-1.5 text-left hover:bg-secondary",
                    search.faixa === faixa && "bg-secondary font-semibold",
                  )}
                >
                  {faixa}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
              Categoria
            </p>
            <div className="flex flex-col gap-1 text-sm">
              <button
                type="button"
                onClick={() => updateSearch({ categoria: undefined })}
                className={cn(
                  "rounded-md px-2 py-1.5 text-left hover:bg-secondary",
                  !search.categoria && "bg-secondary font-semibold",
                )}
              >
                Todas
              </button>
              {categories.map((categoria) => (
                <button
                  key={categoria}
                  type="button"
                  onClick={() => updateSearch({ categoria })}
                  className={cn(
                    "rounded-md px-2 py-1.5 text-left hover:bg-secondary",
                    search.categoria === categoria && "bg-secondary font-semibold",
                  )}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-end gap-2 text-sm">
            <label htmlFor="ordenar" className="text-muted-foreground">
              Ordenar por
            </label>
            <select
              id="ordenar"
              value={search.ordenar ?? "relevancia"}
              onChange={(event) => updateSearch({ ordenar: event.target.value as SortOption })}
              className="rounded-md border border-input bg-background px-2 py-1.5"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <p className="text-lg font-semibold">Nenhum produto encontrado</p>
              <p className="text-sm text-muted-foreground">
                Tente remover alguns filtros ou buscar por outro termo.
              </p>
              <Link
                to="/produtos"
                className="mt-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-white"
              >
                Limpar filtros
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {results.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
