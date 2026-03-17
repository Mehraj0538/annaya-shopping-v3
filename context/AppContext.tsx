'use client';

import React, {
  createContext, useContext, useState,
  useEffect, useCallback, useRef,
} from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Product, CartItem, getImage } from '@/types';

interface AppContextType {
  cart:            CartItem[];
  addToCart:       (product: Product, size: string, color?: string, qty?: number) => Promise<void>;
  removeFromCart:  (productId: string, size: string) => Promise<void>;
  updateQuantity:  (productId: string, size: string, delta: number) => Promise<void>;
  clearCart:       () => void;
  isCartLoading:   boolean;
  wishlist:        string[];
  toggleWishlist:  (productId: string) => Promise<void>;
  isWishlisted:    (productId: string) => boolean;
  lastOrderId:     string | null;
  setLastOrderId:  (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useUser();

  const [cart, setCart]               = useState<CartItem[]>([]);
  const [wishlist, setWishlist]       = useState<string[]>([]);
  const [isCartLoading, setCartLoad]  = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const synced = useRef(false);

  /* ── Sync from server once user is authenticated ─────────────────────── */
  useEffect(() => {
    if (authLoading || !user || synced.current) return;
    synced.current = true;

    const sync = async () => {
      setCartLoad(true);
      try {
        const [cartRes, wlRes] = await Promise.all([
          fetch('/api/cart').then(r => r.json()),
          fetch('/api/wishlist').then(r => r.json()),
        ]);
        if (cartRes.cart?.items) setCart(cartRes.cart.items.map(serverItemToCartItem));
        if (wlRes.wishlist)      setWishlist(wlRes.wishlist);
      } catch { /* fallback to local state */ }
      finally { setCartLoad(false); }
    };
    sync();
  }, [user, authLoading]);

  /* Reset when user logs out */
  useEffect(() => {
    if (!authLoading && !user) {
      synced.current = false;
      setCart([]);
      setWishlist([]);
    }
  }, [user, authLoading]);

  /* ── Cart ─────────────────────────────────────────────────────────────── */
  const addToCart = useCallback(async (product: Product, size: string, color = '', qty = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === product.id && i.selectedSize === size);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
        return copy;
      }
      return [...prev, { ...product, quantity: qty, selectedSize: size, selectedColor: color }];
    });

    if (user) {
      try {
        const res = await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, selectedSize: size, selectedColor: color, quantity: qty }),
        }).then(r => r.json());
        if (res.cart?.items) setCart(res.cart.items.map(serverItemToCartItem));
      } catch { /* keep optimistic state */ }
    }
  }, [user]);

  const removeFromCart = useCallback(async (productId: string, size: string) => {
    setCart(prev => prev.filter(i => !(i.id === productId && i.selectedSize === size)));

    if (user) {
      try {
        const res = await fetch(`/api/cart/remove/${productId}/${encodeURIComponent(size)}`, {
          method: 'DELETE',
        }).then(r => r.json());
        if (res.cart?.items) setCart(res.cart.items.map(serverItemToCartItem));
      } catch { /* keep optimistic state */ }
    }
  }, [user]);

  const updateQuantity = useCallback(async (productId: string, size: string, delta: number) => {
    let newQty = 1;
    setCart(prev => prev.map(i => {
      if (i.id === productId && i.selectedSize === size) {
        newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));

    if (user) {
      try {
        const res = await fetch('/api/cart/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, selectedSize: size, quantity: newQty }),
        }).then(r => r.json());
        if (res.cart?.items) setCart(res.cart.items.map(serverItemToCartItem));
      } catch { /* keep optimistic state */ }
    }
  }, [user]);

  const clearCart = useCallback(() => {
    setCart([]);
    if (user) fetch('/api/cart/clear', { method: 'DELETE' }).catch(() => {});
  }, [user]);

  /* ── Wishlist ─────────────────────────────────────────────────────────── */
  const toggleWishlist = useCallback(async (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );

    if (user) {
      try {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        }).then(r => r.json());
        if (res.wishlist) setWishlist(res.wishlist);
      } catch { /* keep optimistic state */ }
    }
  }, [user]);

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart, isCartLoading,
      wishlist, toggleWishlist, isWishlisted,
      lastOrderId, setLastOrderId,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

/* Map MongoDB cart item → CartItem type used on client */
function serverItemToCartItem(item: any): CartItem {
  return {
    id:              item.productId?.toString() ?? item.id ?? '',
    _id:             item.productId?.toString(),
    name:            item.name,
    slug:            item.slug ?? '',
    description:     item.description ?? '',
    category:        item.category,
    images:          item.images ?? [],
    price:           item.price,
    originalPrice:   item.originalPrice ?? item.price,
    discountPercent: item.discountPercent ?? 0,
    sizes:           item.sizes ?? [],
    colors:          item.colors ?? [],
    stock:           item.stock ?? 0,
    rating:          item.rating ?? 0,
    reviewCount:     item.reviewCount ?? 0,
    isFeatured:      item.isFeatured ?? false,
    isNewArrival:    item.isNewArrival ?? false,
    quantity:        item.quantity,
    selectedSize:    item.selectedSize,
    selectedColor:   item.selectedColor ?? '',
  };
}
