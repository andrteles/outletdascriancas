import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, ShieldCheck, Truck } from "lucide-react";

import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatInstallments, formatPixPrice, formatPrice } from "@/lib/format";
import { getProductBySlug, getRelatedProducts, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

function metaDescription(product: Product): string {
  const plain = (product.description ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) {
    return `${product.title} - Carter's, ${formatPrice(product.price)}`;
  }
  return plain.length > 160 ? `${plain.slice(0, 157)}...` : plain;
}

export const Route = createFileRoute("/produtos/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} · Outlet das Crianças` },
          {
            name: "description",
            content: metaDescription(loaderData),
          },
        ]
      : [],
  }),
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const related = getRelatedProducts(product);
  const { addItem, openCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  function handleAddToCart() {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addItem(product, selectedSize);
    openCart();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <ChevronRight className="size-3" />
        <Link
          to="/produtos"
          search={{ categoria: product.category }}
          className="hover:text-foreground"
        >
          {product.category}
        </Link>
        <ChevronRight className="size-3" />
        <span className="line-clamp-1 text-foreground">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-surface">
            {product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          {product.images.length > 1 ? (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "aspect-square overflow-hidden rounded-lg border-2",
                    index === selectedImage ? "border-primary" : "border-transparent",
                  )}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-sm font-semibold text-muted-foreground">{product.brand}</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight font-display">
            {product.title}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold">{formatPrice(product.price)}</span>
            {product.compareAtPrice ? (
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
            {product.discountPercent ? (
              <span className="rounded-md bg-sale px-2 py-1 text-xs font-bold text-sale-foreground">
                -{product.discountPercent}%
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatInstallments(product.price)} · ou {formatPixPrice(product.price)} no PIX
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">Tamanho</p>
              {sizeError ? <p className="text-xs text-destructive">Selecione um tamanho</p> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(false);
                  }}
                  className={cn(
                    "rounded-md border px-3.5 py-2 text-sm font-medium transition-colors",
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input hover:border-primary",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" className="mt-6 w-full text-white uppercase" onClick={handleAddToCart}>
            Adicionar à sacola
          </Button>

          <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Truck className="size-4 shrink-0" /> Frete grátis acima de R$ 199
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0" /> Produto original Carter's, com garantia de
              troca em 30 dias
            </p>
          </div>
        </div>
      </div>

      {product.description ? (
        <section className="mt-12 max-w-3xl border-t border-border pt-8">
          <h2 className="mb-3 text-xl font-extrabold tracking-tight font-display">Descrição</h2>
          <div
            className="text-sm leading-relaxed text-muted-foreground [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-foreground"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-4 text-xl font-extrabold tracking-tight font-display">
            Você também pode gostar
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
