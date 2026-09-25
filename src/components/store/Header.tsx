import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useCart } from "@/lib/cart";
import { categories } from "@/lib/products";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Promoções", search: { ordenar: "maior-desconto" as const } },
  { label: "Bebê", search: { faixa: "Bebê" } },
  { label: "Infantil", search: { faixa: "Infantil" } },
  { label: "Kits e Conjuntos", search: { categoria: "Kits" } },
];

const announcements = [
  "Frete Grátis para todo Brasil",
  "Garantia de troca em 30 dias, direto com a loja",
];

function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((current) => (current + 1) % announcements.length);
        setVisible(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary py-2.5 text-center text-[11px] font-bold tracking-wide text-white uppercase">
      <span
        className={cn(
          "inline-block transition-all duration-300 ease-in-out",
          visible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
        )}
      >
        {announcements[index]}
      </span>
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { totalItems, openCart } = useCart();

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    navigate({ to: "/produtos", search: query.trim() ? { busca: query.trim() } : {} });
    setMenuOpen(false);
  }

  return (
    <>
      <AnnouncementBar />

      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2.5 sm:px-6">
          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-9 shrink-0 place-items-center rounded-full text-foreground hover:bg-secondary"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <form
            onSubmit={handleSearch}
            className="flex flex-1 items-center gap-2 rounded-full border border-input px-3 py-2 focus-within:ring-1 focus-within:ring-ring"
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

          <button
            type="button"
            aria-label="Abrir sacola"
            onClick={openCart}
            className="relative grid size-9 shrink-0 place-items-center rounded-full text-foreground hover:bg-secondary"
          >
            <ShoppingBag className="size-5" />
            {totalItems > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 grid size-4.5 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">
                {totalItems}
              </span>
            ) : null}
          </button>
        </div>

        {menuOpen ? (
          <div className="border-b border-border px-4 py-4">
            <nav className="flex flex-col gap-1 text-sm font-medium">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-2.5 text-foreground hover:bg-secondary"
              >
                Início
              </Link>
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
            <div className="mt-3 border-t border-border pt-3">
              <p className="px-2 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Categorias
              </p>
              <div className="flex flex-wrap gap-1.5 px-2">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to="/produtos"
                    search={{ categoria: category }}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:border-primary hover:text-primary"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}
