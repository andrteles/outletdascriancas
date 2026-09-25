import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { getProductBySlug } from "@/lib/products";
import { trackMetaPixelEvent, trackPixelEvent, trackTikTokEvent } from "@/lib/tracking";
import { createZedyCheckout } from "@/lib/zedy";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } =
    useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  // Trava a posição do body enquanto a gaveta está aberta (não só
  // overflow:hidden). Sem isso o Safari do iOS pode continuar animando a
  // barra de endereço com o fundo da página "roubando" scroll por baixo da
  // gaveta, e qualquer altura calculada pra gaveta fica correndo atrás de
  // uma barra que ainda está se movendo — daí o vão persistente no topo/base.
  useEffect(() => {
    if (!isOpen) return;
    const { body } = document;
    const scrollY = window.scrollY;
    const original = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    return () => {
      body.style.position = original.position;
      body.style.top = original.top;
      body.style.left = original.left;
      body.style.right = original.right;
      body.style.width = original.width;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

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

    const eventId = `checkout-${Date.now()}`;
    const contents = items.flatMap((item) => {
      const product = getProductBySlug(item.slug);
      return product
        ? [
            {
              contentId: product.slug,
              contentName: product.title,
              quantity: item.quantity,
              price: product.price,
            },
          ]
        : [];
    });
    trackPixelEvent("InitiateCheckout", eventId, { value: totalPrice, contents });
    trackMetaPixelEvent("InitiateCheckout", eventId, {
      value: totalPrice,
      contentIds: items.map((item) => item.slug),
      numItems: totalItems,
    });
    trackTikTokEvent({
      data: {
        event: "InitiateCheckout",
        eventId,
        url: window.location.href,
        value: totalPrice,
        contents,
      },
    }).catch(() => {});

    window.location.href = result.checkoutUrl;
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? undefined : closeCart())}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-base font-extrabold font-display">
            <ShoppingBag className="size-5" /> Sua sacola
          </SheetTitle>
        </SheetHeader>

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

            <div className="border-t border-border px-5 pt-4 pb-10">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-extrabold">{formatPrice(totalPrice)}</span>
              </div>
              <Button
                size="lg"
                disabled={checkingOut}
                onClick={handleCheckout}
                className="w-full bg-[#3BAE8A] font-bold text-white uppercase hover:bg-[#3BAE8A]/90"
              >
                {checkingOut ? <Loader2 className="size-5 animate-spin" /> : "Finalizar compra"}
              </Button>
              <Button
                asChild
                size="lg"
                onClick={closeCart}
                className="mt-2 w-full bg-black font-bold text-white uppercase hover:bg-black/90"
              >
                <Link to="/produtos" search={{}}>
                  Continuar Comprando
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
