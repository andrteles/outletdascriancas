import { Link } from "@tanstack/react-router";

import { categories } from "@/lib/products";

const bandeiras = [
  { nome: "Visa", className: "bg-white text-[#1A1F71] italic" },
  { nome: "Elo", className: "bg-white text-foreground" },
  { nome: "Amex", className: "bg-[#006FCF] text-white" },
  { nome: "Hipercard", className: "bg-[#B3131B] text-white" },
];

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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-muted-foreground md:flex-row">
          <p>© 2026 - Outlet</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <p>Pagamento no PIX ou em até 12x no cartão</p>
            <div className="flex items-center gap-1.5">
              <span
                aria-label="Pix"
                className="flex h-5 items-center justify-center rounded-[3px] border border-border bg-[#32BCAD] px-1.5 text-[9px] font-extrabold tracking-tight text-white"
              >
                Pix
              </span>
              <span
                aria-label="Mastercard"
                className="flex h-5 w-8 items-center justify-center rounded-[3px] border border-border bg-white"
              >
                <svg width="18" height="11" viewBox="0 0 18 11" aria-hidden="true">
                  <circle cx="6" cy="5.5" r="5.5" fill="#EB001B" />
                  <circle cx="12" cy="5.5" r="5.5" fill="#F79E1B" className="mix-blend-multiply" />
                </svg>
              </span>
              {bandeiras.map((bandeira) => (
                <span
                  key={bandeira.nome}
                  className={`flex h-5 items-center justify-center rounded-[3px] border border-border px-1.5 text-[9px] font-extrabold tracking-tight ${bandeira.className}`}
                >
                  {bandeira.nome}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
