import { useCallback, useEffect, useMemo, useState } from 'react';
import orderService from '../services/orderService';
import { useCart } from '../context/CartContext';
import { calculateDeliveryCost, euclideanDistance } from '../utils/delivery';
import type { Zone, CartItem, OrderResult, CheckoutErrors } from '../types/models';

export type { Zone, CartItem, OrderResult, CheckoutErrors };

export function useCheckout() {
  const { store, items, subtotal, updateQuantity, clearCart, setLastOrderId } = useCart();
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [referenciaEntrega, setReferenciaEntrega] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingZones, setIsLoadingZones] = useState(true);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setIsLoadingZones(true);
        setErrors((previous) => ({ ...previous, general: undefined }));

        const apiZones = await orderService.getZones();

        if (!active) {
          return;
        }

        setZones(
          apiZones.map((zone) => ({
            ...zone,
            costo_envio: store
              ? calculateDeliveryCost(
                  euclideanDistance(store.lat, store.lng, zone.lat, zone.lng)
                )
              : 0,
          }))
        );
      } catch (err: any) {
        if (active) {
          setErrors((previous) => ({
            ...previous,
            general: err?.message ?? 'No se pudieron cargar las zonas de entrega.',
          }));
        }
      } finally {
        if (active) {
          setIsLoadingZones(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [store]);

  const deliveryFee = useMemo(
    () => selectedZone?.costo_envio ?? 0,
    [selectedZone]
  );

  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  const selectZone = useCallback((zone: Zone) => {
    setSelectedZone(zone);
    setErrors((previous) => ({
      ...previous,
      zona: undefined,
      general: undefined,
    }));
  }, []);

  const validate = useCallback((): boolean => {
    const nextErrors: CheckoutErrors = {};

    if (!store) {
      nextErrors.general = 'Selecciona una tienda antes de confirmar el pedido.';
    }

    if (!selectedZone) {
      nextErrors.zona = 'Debes seleccionar una zona de entrega.';
    }

    if (!referenciaEntrega.trim()) {
      nextErrors.referenciaEntrega = 'La referencia de entrega es obligatoria.';
    }

    const hasProducts = items.some((item) => item.cantidad > 0);

    if (!hasProducts) {
      nextErrors.cart = 'Agrega al menos un producto al carrito.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [store, selectedZone, referenciaEntrega, items]);

  const submitOrder = useCallback(async (): Promise<OrderResult | null> => {
    if (!validate()) {
      return null;
    }

    setIsSubmitting(true);

    try {
      const createdOrder = await orderService.createOrder({
        storeId: store.id,
        subtotal,
        lat: selectedZone.lat,
        lng: selectedZone.lng,
        referenceText: referenciaEntrega.trim(),
      });

      setOrderResult(createdOrder);
      setLastOrderId(String(createdOrder.id));
      clearCart();
      setSelectedZone(null);
      setReferenciaEntrega('');

      return createdOrder;
    } catch (err: any) {
      setErrors((previous) => ({
        ...previous,
        general: err?.message ?? 'No se pudo registrar el pedido.',
      }));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validate,
    store,
    subtotal,
    selectedZone,
    referenciaEntrega,
    setLastOrderId,
    clearCart,
  ]);

  const resetOrder = useCallback(() => {
    setOrderResult(null);
  }, []);

  return {
    store,
    zones,
    selectedZone,
    referenciaEntrega,
    setReferenciaEntrega,
    cartItems: items,
    isSubmitting,
    isLoadingZones,
    errors,
    orderResult,
    subtotal,
    deliveryFee,
    total,
    selectZone,
    updateQuantity,
    submitOrder,
    resetOrder,
  };
}
