import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? undefined : closeCart())}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            Sua sacola
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Sua sacola está vazia.</p>
            <Button onClick={closeCart} asChild>
              <Link to="/produtos">Ver produtos</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="-mx-6 flex-1 overflow-y-auto px-6">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={`${item.slug}-${item.size}`} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="size-20 shrink-0 rounded-lg bg-surface object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Tamanho: {item.size}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-border">
                          <button
                            type="button"
                            aria-label="Diminuir quantidade"
                            onClick={() => updateQuantity(item.slug, item.size, item.quantity - 1)}
                            className="grid size-7 place-items-center text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-4 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Aumentar quantidade"
                            onClick={() => updateQuantity(item.slug, item.size, item.quantity + 1)}
                            className="grid size-7 place-items-center text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">
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
            </div>

            <SheetFooter className="flex-col gap-3 border-t border-border pt-4 sm:flex-col">
              <div className="flex w-full items-center justify-between text-base font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="w-full text-xs text-muted-foreground">
                Frete e parcelamento calculados na próxima etapa.
              </p>
              <Button asChild size="lg" className="w-full" onClick={closeCart}>
                <Link to="/carrinho">Finalizar compra</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
