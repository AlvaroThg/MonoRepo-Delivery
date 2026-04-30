import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { CartItem, Product, Store } from '../types/models';

interface CartContextValue {
  store: Store | null;
  items: CartItem[];
  lastOrderId: string | null;
  subtotal: number;
  totalItems: number;
  addProduct: (store: Store, product: Product) => boolean;
  updateQuantity: (productId: number, newQty: number) => void;
  clearCart: () => void;
  setLastOrderId: (orderId: string | null) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const addProduct = useCallback(
    (nextStore: Store, product: Product): boolean => {
      const replacedStore = !!store && store.id !== nextStore.id;

      setStore(nextStore);
      setItems((previousItems) => {
        if (replacedStore) {
          return [{ ...product, cantidad: 1 }];
        }

        const existingItem = previousItems.find((item) => item.id === product.id);

        if (existingItem) {
          return previousItems.map((item) =>
            item.id === product.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          );
        }

        return [...previousItems, { ...product, cantidad: 1 }];
      });

      return replacedStore;
    },
    [store]
  );

  const updateQuantity = useCallback((productId: number, newQty: number) => {
    setItems((previousItems) => {
      const nextItems = previousItems
        .map((item) =>
          item.id === productId
            ? { ...item, cantidad: Math.max(0, newQty) }
            : item
        )
        .filter((item) => item.cantidad > 0);

      if (nextItems.length === 0) {
        setStore(null);
      }

      return nextItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setStore(null);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.cantidad, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      store,
      items,
      lastOrderId,
      subtotal,
      totalItems,
      addProduct,
      updateQuantity,
      clearCart,
      setLastOrderId,
    }),
    [
      store,
      items,
      lastOrderId,
      subtotal,
      totalItems,
      addProduct,
      updateQuantity,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a <CartProvider>');
  }

  return context;
}
