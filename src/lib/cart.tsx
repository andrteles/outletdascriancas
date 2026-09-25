import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getProductBySlug, type Product } from "@/lib/products";

export interface CartItem {
  slug: string;
  size: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (slug: string, size: string, quantity?: number) => void;
  removeItem: (slug: string, size: string) => void;
  updateQuantity: (slug: string, size: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "gaveta-cart";

function loadItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        typeof item?.slug === "string" &&
        typeof item?.size === "string" &&
        typeof item?.quantity === "number" &&
        item.quantity > 0 &&
        getProductBySlug(item.slug),
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(loadItems());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage indisponível — ignora
    }
  }, [items]);

  const addItem = useCallback((slug: string, size: string, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.slug === slug && item.size === size);
      if (existing) {
        return current.map((item) =>
          item.slug === slug && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...current, { slug, size, quantity }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((slug: string, size: string) => {
    setItems((current) => current.filter((item) => !(item.slug === slug && item.size === size)));
  }, []);

  const updateQuantity = useCallback((slug: string, size: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((item) => !(item.slug === slug && item.size === size))
        : current.map((item) =>
            item.slug === slug && item.size === size ? { ...item, quantity } : item,
          ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    let totalItems = 0;
    let totalPrice = 0;
    for (const item of items) {
      const product: Product | undefined = getProductBySlug(item.slug);
      if (!product) continue;
      totalItems += item.quantity;
      totalPrice += product.price * item.quantity;
    }
    return {
      items,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      totalItems,
      totalPrice,
    };
  }, [items, isOpen, openCart, closeCart, addItem, removeItem, updateQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return context;
}
