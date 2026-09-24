import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

import { categories } from "@/lib/products";
import { useCart } from "@/lib/cart";

const navLinks = [
  { label: "Bebê", search: { faixa: "Bebê" } },
  { label: "Infantil", search: { faixa: "Infantil" } },
  { label: "Kits e Conjuntos", search: { categoria: "Kits" } },
  { label: "Promoções", search: { ordenar: "maior-desconto" as const } },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { itemCount, openCart } = useCart();

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    navigate({ to: "/produtos", search: query.trim() ? { busca: query.trim() } : {} });
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="bg-primary py-2 text-center text-[11px] font-bold tracking-wide text-primary-foreground uppercase">
        Frete grátis acima de R$ 199 · Até 60% OFF em peças selecionadas
      </div>

      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-9 shrink-0 place-items-center rounded-full text-foreground hover:bg-secondary md:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <Link to="/" className="shrink-0 font-display text-xl font-extrabold tracking-tight">
            <span className="text-primary">outlet</span>
            <span className="text-foreground"> das crianças</span>
          </Link>

          <nav className="hidden items-center gap-6 pl-6 text-sm font-medium md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to="/produtos"
                search={item.search}
                className="text-foreground transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="ml-auto hidden max-w-sm flex-1 md:flex">
            <div className="flex w-full items-center gap-2 rounded-full border border-input px-4 py-2 focus-within:ring-1 focus-within:ring-ring">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar produtos"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </form>

          <button
            type="button"
            onClick={openCart}
            aria-label="Abrir sacola"
            className="relative ml-auto grid size-9 shrink-0 place-items-center rounded-full text-foreground hover:bg-secondary md:ml-0"
          >
            <ShoppingBag className="size-5" />
            {itemCount > 0 ? (
              <span className="absolute -top-1 -right-1 grid size-4.5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            ) : null}
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-border px-4 py-4 md:hidden">
            <form
              onSubmit={handleSearch}
              className="mb-4 flex items-center gap-2 rounded-full border border-input px-4 py-2"
            >
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar produtos"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </form>
            <nav className="flex flex-col gap-1 text-sm font-medium">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to="/produtos"
                  search={item.search}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-2 py-2.5 text-foreground hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/produtos"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-2.5 text-foreground hover:bg-secondary"
              >
                Todos os produtos
              </Link>
            </nav>
          </div>
        ) : null}
      </div>

      <div className="hidden border-b border-border bg-surface md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-6 py-2 text-xs text-muted-foreground">
          {categories.map((category) => (
            <Link
              key={category}
              to="/produtos"
              search={{ categoria: category }}
              className="transition-colors hover:text-primary"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
