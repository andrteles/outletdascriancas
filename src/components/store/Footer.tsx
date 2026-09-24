import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { categories } from "@/lib/products";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="max-w-[34ch] text-sm text-muted-foreground">
            Roupas para bebês e crianças com até 60% de desconto. Peças originais, preços de outlet.
          </p>
          <form
            className="mt-6 flex max-w-sm gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (email.trim()) setSubscribed(true);
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSubscribed(false);
              }}
              placeholder="seu@email.com"
              aria-label="Seu e-mail para receber promoções"
              className="min-w-0 flex-1 rounded-full border border-input px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Assinar
            </button>
          </form>
          <p
            className={`mt-2 text-xs text-primary transition-opacity ${subscribed ? "opacity-100" : "opacity-0"}`}
          >
            Pronto — promoções exclusivas a caminho.
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
          <p>© 2026 Outlet das Crianças</p>
          <p>Pagamento em até 12x no cartão (Não tem desconto no pix)</p>
        </div>
      </div>
    </footer>
  );
}
