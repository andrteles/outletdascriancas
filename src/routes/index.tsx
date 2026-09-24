import { createFileRoute, Link } from "@tanstack/react-router";
import { Percent, RefreshCcw, ShieldCheck, Truck } from "lucide-react";

import { ProductCard } from "@/components/store/ProductCard";
import { filterProducts, products } from "@/lib/products";
import { formatPrice } from "@/lib/format";

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

const faixas = [
  { rotulo: "Bebê", faixa: "0 a 24 meses", href: { faixa: "Bebê" } },
  { rotulo: "Infantil", faixa: "2 a 14 anos", href: { faixa: "Infantil" } },
];

const categoriasDestaque = ["Kits", "Conjuntos", "Macacões", "Pijamas", "Vestidos", "Camisetas"];

const promessas = [
  { icon: Truck, titulo: "Frete grátis", texto: "Em compras acima de R$ 199" },
  { icon: RefreshCcw, titulo: "Troca fácil", texto: "Até 30 dias para trocar" },
  { icon: ShieldCheck, titulo: "100% original", texto: "Produtos Carter's oficiais" },
  { icon: Percent, titulo: "Até 6x sem juros", texto: "Ou PIX com 5% de desconto" },
];

function Home() {
  const ofertas = filterProducts({ ordenar: "maior-desconto" });
  const heroDestaques = ofertas.slice(0, 4);
  const vitrine = ofertas.slice(4, 12);
  const maiorDesconto = ofertas[0];

  return (
    <div>
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl grid-cols-12 items-center gap-6 px-6 py-12 md:py-16">
          <div className="col-span-12 md:col-span-6">
            <p className="text-sm font-bold tracking-wide text-primary uppercase">
              Outlet oficial Carter's
            </p>
            <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight text-foreground md:text-6xl font-display">
              Até {maiorDesconto?.discountPercent ?? 60}% OFF
              <br />
              em roupas Carter's
            </h1>
            <p className="mt-4 max-w-[46ch] text-base text-muted-foreground">
              Peças originais para bebês e crianças, do recém-nascido aos 14 anos. Preço de outlet,
              qualidade Carter's.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/produtos"
                search={{ ordenar: "maior-desconto" }}
                className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Ver ofertas
              </Link>
              <Link
                to="/produtos"
                className="rounded-full border border-input bg-background px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
              >
                Todos os produtos
              </Link>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="grid grid-cols-2 gap-3">
              {heroDestaques.map((product) => (
                <Link
                  key={product.slug}
                  to="/produtos/$slug"
                  params={{ slug: product.slug }}
                  className="group relative overflow-hidden rounded-2xl bg-surface"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.discountPercent ? (
                    <span className="absolute top-2 left-2 rounded-md bg-sale px-2 py-1 text-xs font-bold text-sale-foreground">
                      -{product.discountPercent}%
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-4">
        <div className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-2 md:grid-cols-4">
          {promessas.map((promessa) => (
            <div
              key={promessa.titulo}
              className="flex items-center gap-3 rounded-xl border border-border p-4"
            >
              <promessa.icon className="size-7 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-bold">{promessa.titulo}</p>
                <p className="text-xs text-muted-foreground">{promessa.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-2xl font-extrabold tracking-tight font-display">Compre por idade</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {faixas.map((item) => (
            <Link
              key={item.rotulo}
              to="/produtos"
              search={item.href}
              className="group relative flex items-center justify-between overflow-hidden rounded-2xl bg-primary px-8 py-10 text-primary-foreground"
            >
              <div>
                <p className="text-3xl font-extrabold font-display">{item.rotulo}</p>
                <p className="mt-1 text-sm opacity-90">{item.faixa}</p>
              </div>
              <span className="text-sm font-bold underline underline-offset-4 transition-opacity group-hover:opacity-80">
                Ver produtos →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6">
        <h2 className="text-2xl font-extrabold tracking-tight font-display">Categorias</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {categoriasDestaque.map((categoria) => {
            const exemplo = products.find((p) => p.category === categoria);
            return (
              <Link
                key={categoria}
                to="/produtos"
                search={{ categoria }}
                className="group overflow-hidden rounded-xl border border-border"
              >
                {exemplo ? (
                  <img
                    src={exemplo.images[0]}
                    alt={categoria}
                    className="aspect-square w-full bg-surface object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : null}
                <p className="p-2.5 text-center text-sm font-semibold">{categoria}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight font-display">
            Ofertas imperdíveis
          </h2>
          <Link
            to="/produtos"
            search={{ ordenar: "maior-desconto" }}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {vitrine.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl bg-secondary px-8 py-10 text-center">
          <p className="text-sm font-bold tracking-wide text-primary uppercase">Vantagem outlet</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight font-display">
            Parcele em até 6x sem juros
          </h2>
          <p className="mx-auto mt-2 max-w-[50ch] text-sm text-muted-foreground">
            Ou pague com PIX e ganhe 5% de desconto em qualquer compra. Preços já com o desconto do
            outlet — sem cupom, sem pegadinha.
          </p>
          {maiorDesconto ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Exemplo: {maiorDesconto.title} por {formatPrice(maiorDesconto.price)}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
