import { Link } from "@tanstack/react-router";

import { categories } from "@/lib/products";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="max-w-[34ch] text-sm text-muted-foreground">
            Roupas para bebês e crianças com até 60% de desconto. Peças originais, preços de outlet.
          </p>
        </div>

        <div className="md:col-span-3 md:col-start-6">
          <p className="mb-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Categorias
          </p>
          <ul className="space-y-2 text-sm">
            {categories.slice(0, 6).map((category) => (
              <li key={category}>
                <Link
                  to="/produtos"
                  search={{ categoria: category }}
                  className="text-foreground transition-colors hover:text-primary"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="mb-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Ajuda
          </p>
          <ul className="space-y-2 text-sm text-foreground">
            <li>Trocas e devoluções</li>
            <li>Frete e entrega</li>
            <li>Guia de tamanhos</li>
            <li>Fale conosco</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-muted-foreground md:flex-row">
          <p>© 2026 Outlet</p>
          <p>Pagamento em até 12x no cartão</p>
        </div>
      </div>
    </footer>
  );
}
