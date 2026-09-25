import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { getProductBySlug } from "@/lib/products";
import { createZedyCheckout } from "@/lib/zedy";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  async function handleCheckout() {
    if (items.length === 0) return;
    setCheckingOut(true);
    const result = await createZedyCheckout({
      data: {
        items: items.map((item) => ({
          slug: item.slug,
          size: item.size,
          quantity: item.quantity,
        })),
      },
    });
    setCheckingOut(false);
    if (!result.ok) {
      toast.error("Não foi possível iniciar o checkout. Tente novamente.");
      return;
    }
    window.location.href = result.checkoutUrl;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fechar sacola"
        onClick={closeCart}
        className="absolute inset-0 bg-foreground/40"
      />
      <aside className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-extrabold font-display">
            <ShoppingBag className="size-5" /> Sua sacola
          </h2>
          <button
            type="button"
            aria-label="Fechar"
            onClick={closeCart}
            className="grid size-9 place-items-center rounded-full hover:bg-secondary"
          >
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Sua sacola está vazia.</p>
            <Button asChild variant="outline" onClick={closeCart}>
              <Link to="/produtos" search={{}}>
                Ver produtos
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((item) => {
                const product = getProductBySlug(item.slug);
                if (!product) return null;
                return (
                  <li key={`${item.slug}-${item.size}`} className="flex gap-3 py-4">
                    <Link
                      to="/produtos/$slug"
                      params={{ slug: product.slug }}
                      onClick={closeCart}
                      className="size-20 shrink-0 overflow-hidden rounded-lg bg-surface"
                    >
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold leading-snug">{product.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Tamanho: {item.size}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label="Remover item"
                          onClick={() => removeItem(item.slug, item.size)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-md border border-input">
                          <button
                            type="button"
                            aria-label="Diminuir quantidade"
                            onClick={() => updateQuantity(item.slug, item.size, item.quantity - 1)}
                            className="grid size-7 place-items-center hover:bg-secondary"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Aumentar quantidade"
                            onClick={() => updateQuantity(item.slug, item.size, item.quantity + 1)}
                            className="grid size-7 place-items-center hover:bg-secondary"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <p className="text-sm font-bold">
                          {formatPrice(product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-border px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-extrabold">{formatPrice(totalPrice)}</span>
              </div>
              <Button
                size="lg"
                disabled={checkingOut}
                onClick={handleCheckout}
                className="w-full text-white font-bold uppercase"
              >
                {checkingOut ? <Loader2 className="size-5 animate-spin" /> : "Finalizar compra"}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Frete grátis para todo o Brasil
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
