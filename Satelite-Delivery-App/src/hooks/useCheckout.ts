import { useState, useMemo, useCallback } from 'react';
import { MOCK_ZONES, MOCK_PRODUCTS, MOCK_ORDERS } from '../api/mockData';
import type { Zone, CartItem, OrderItem, OrderResult, CheckoutErrors } from '../types/models';

// Re-exportamos para compatibilidad con componentes que ya importan desde aquí
export type { Zone, CartItem, OrderItem, OrderResult, CheckoutErrors };

/**
 * Hook de lógica de negocio para la Pantalla de Checkout.
 * Encapsula selección de zona, carrito, validación y submit simulado.
 */
export function useCheckout() {
  // ── Estado ────────────────────────────────────────────────
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [referenciaEntrega, setReferenciaEntrega] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>(
    MOCK_PRODUCTS.map((p) => ({ ...p, cantidad: 1 }))
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  // ── Cálculos derivados ────────────────────────────────────
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    [cartItems]
  );

  const deliveryFee = useMemo(
    () => selectedZone?.costo_envio ?? 0,
    [selectedZone]
  );

  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  // ── Acciones ──────────────────────────────────────────────
  const selectZone = useCallback((zone: Zone) => {
    setSelectedZone(zone);
    setErrors((prev) => ({ ...prev, zona: undefined }));
  }, []);

  const updateQuantity = useCallback((productId: number, newQty: number) => {
    if (newQty < 0) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, cantidad: newQty } : item
      )
    );
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: CheckoutErrors = {};
    if (!selectedZone) {
      newErrors.zona = 'Debes seleccionar una zona de entrega.';
    }
    if (!referenciaEntrega.trim()) {
      newErrors.referenciaEntrega = 'La referencia de entrega es obligatoria.';
    }
    const hasProducts = cartItems.some((item) => item.cantidad > 0);
    if (!hasProducts) {
      newErrors.cart = 'Agrega al menos un producto al carrito.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [selectedZone, referenciaEntrega, cartItems]);

  const submitOrder = useCallback(async (): Promise<OrderResult | null> => {
    if (!validate()) return null;

    setIsSubmitting(true);
    try {
      // Simula latencia de red
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Simula la respuesta del backend usando MOCK_ORDERS
      const mockResponse: OrderResult = {
        ...MOCK_ORDERS[0],
        zona_id: selectedZone!.id,
        referencia_entrega: referenciaEntrega,
        costo_envio: deliveryFee,
        total_precio: total,
        items: cartItems
          .filter((item) => item.cantidad > 0)
          .map((item) => ({
            producto_id: item.id,
            cantidad: item.cantidad,
            precio_en_compra: item.precio,
          })),
      };

      setOrderResult(mockResponse);
      return mockResponse;
    } finally {
      setIsSubmitting(false);
    }
  }, [validate, selectedZone, referenciaEntrega, deliveryFee, total, cartItems]);

  const resetOrder = useCallback(() => {
    setOrderResult(null);
  }, []);

  // ── API pública ───────────────────────────────────────────
  return {
    // Estado
    zones: MOCK_ZONES as Zone[],
    selectedZone,
    referenciaEntrega,
    setReferenciaEntrega,
    cartItems,
    isSubmitting,
    errors,
    orderResult,
    // Cálculos
    subtotal,
    deliveryFee,
    total,
    // Acciones
    selectZone,
    updateQuantity,
    submitOrder,
    resetOrder,
  };
}
