import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatInstallmentsComJuros, formatPixPrice, formatPrice } from "@/lib/format";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [{ title: "Outlet" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  function handleCheckout() {
    toast.info("Checkout em breve", {
      description: "A integração de pagamento ainda não está disponível nesta loja.",
    });
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
        <ShoppingBag className="size-12 text-muted-foreground" />
        <h1 className="text-xl font-bold">Sua sacola está vazia</h1>
        <p className="text-sm text-muted-foreground">
          Explore nossos produtos e encontre as melhores ofertas Carter's.
        </p>
        <Button asChild size="lg">
          <Link to="/produtos">Ver produtos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-extrabold tracking-tight font-display">Sua sacola</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[1fr_320px]">
        <ul className="flex flex-col gap-5">
          {items.map((item) => (
            <li
              key={`${item.slug}-${item.size}`}
              className="flex gap-4 border-b border-border pb-5"
            >
              <Link to="/produtos/$slug" params={{ slug: item.slug }} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="size-24 rounded-lg bg-surface object-cover"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  to="/produtos/$slug"
                  params={{ slug: item.slug }}
                  className="text-sm font-medium hover:text-primary"
                >
                  {item.title}
                </Link>
                <p className="mt-0.5 text-xs text-muted-foreground">Tamanho: {item.size}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2 rounded-full border border-border">
                    <button
                      type="button"
                      aria-label="Diminuir quantidade"
                      onClick={() => updateQuantity(item.slug, item.size, item.quantity - 1)}
                      className="grid size-8 place-items-center text-muted-foreground hover:text-foreground"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-5 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Aumentar quantidade"
                      onClick={() => updateQuantity(item.slug, item.size, item.quantity + 1)}
                      className="grid size-8 place-items-center text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <span className="text-sm font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Remover item"
                onClick={() => removeItem(item.slug, item.size)}
                className="self-start text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-xl border border-border p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Resumo
          </h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
            <span>Frete</span>
            <span>{subtotal >= 199 ? "Grátis" : "Calculado na próxima etapa"}</span>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-sm font-semibold">{formatInstallmentsComJuros(subtotal)}</p>
            <p className="text-sm text-muted-foreground">ou {formatPixPrice(subtotal)} no PIX</p>
          </div>
          <Button
            size="lg"
            className="mt-5 w-full bg-[#3BAE8A] font-bold text-white uppercase hover:bg-[#3BAE8A]/90"
            onClick={handleCheckout}
          >
            Finalizar compra
          </Button>
          <Button
            asChild
            size="lg"
            className="mt-3 w-full bg-black font-bold text-white uppercase hover:bg-black/90"
          >
            <Link to="/produtos">Continuar Comprando</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
