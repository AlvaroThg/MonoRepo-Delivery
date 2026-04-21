/**
 * @file CartSummary.tsx
 *
 * Resumen del carrito: lista de productos con controles de cantidad
 * y desglose de precios (subtotal / envío / total).
 *
 * Props:
 *  - items            : CartItem[]           — productos en carrito
 *  - subtotal         : number               — suma de (precio × cantidad)
 *  - deliveryFee      : number               — costo de envío (0 = no seleccionado)
 *  - total            : number               — subtotal + envío
 *  - onUpdateQuantity : (id, qty) => void    — callback para ± cantidad
 *  - error?           : string               — error global del carrito
 */

import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { CartItem } from '../../types/models';
import { styles } from './CartSummary.styles';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CartSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  onUpdateQuantity: (productId: number, newQty: number) => void;
  error?: string;
}

// ─── Sub-componente: fila de un producto ─────────────────────────────────────

interface ProductRowProps {
  item: CartItem;
  isLast: boolean;
  onUpdateQuantity: (id: number, qty: number) => void;
}

function ProductRow({ item, isLast, onUpdateQuantity }: ProductRowProps) {
  const lineTotal = item.precio * item.cantidad;

  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      {/* Info del producto */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.nombre}
        </Text>
        <Text style={styles.productPrice}>Bs {item.precio.toFixed(2)}</Text>
        {!item.estado_stock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Sin stock</Text>
          </View>
        )}
      </View>

      {/* Controles ± */}
      <View style={styles.qtyControls}>
        <TouchableOpacity
          style={[styles.qtyBtn, item.cantidad === 0 && styles.qtyBtnDisabled]}
          onPress={() => onUpdateQuantity(item.id, item.cantidad - 1)}
          disabled={item.cantidad === 0}
          accessibilityLabel={`Reducir cantidad de ${item.nombre}`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.qtyBtnText}>−</Text>
        </TouchableOpacity>

        <Text style={[styles.qtyValue, item.cantidad === 0 && styles.qtyValueZero]}>
          {item.cantidad}
        </Text>

        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => onUpdateQuantity(item.id, item.cantidad + 1)}
          disabled={!item.estado_stock}
          accessibilityLabel={`Aumentar cantidad de ${item.nombre}`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Subtotal por línea */}
      <Text style={[styles.lineTotal, lineTotal === 0 && styles.lineTotalZero]}>
        Bs {lineTotal.toFixed(2)}
      </Text>
    </View>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function CartSummary({
  items,
  subtotal,
  deliveryFee,
  total,
  onUpdateQuantity,
  error,
}: CartSummaryProps) {
  const activeCount = items.reduce((acc, i) => acc + i.cantidad, 0);

  const handleUpdate = useCallback(
    (id: number, qty: number) => onUpdateQuantity(id, qty),
    [onUpdateQuantity]
  );

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Tu Pedido</Text>
        <Text style={styles.itemCount}>
          {activeCount} {activeCount === 1 ? 'producto' : 'productos'}
        </Text>
      </View>

      {/* ── Lista de productos ── */}
      {items.map((item, index) => (
        <ProductRow
          key={item.id}
          item={item}
          isLast={index === items.length - 1}
          onUpdateQuantity={handleUpdate}
        />
      ))}

      {/* Error global */}
      {!!error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.divider} />

      {/* ── Desglose de totales ── */}
      <View style={styles.totalsSection}>
        {/* Subtotal */}
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Subtotal</Text>
          <Text style={styles.totalsValue}>Bs {subtotal.toFixed(2)}</Text>
        </View>

        {/* Envío */}
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Costo de Envío</Text>
          {deliveryFee > 0 ? (
            <Text style={styles.totalsValue}>Bs {deliveryFee.toFixed(2)}</Text>
          ) : (
            <Text style={styles.totalsValuePending}>Selecciona zona</Text>
          )}
        </View>

        {/* Total */}
        <View style={[styles.totalsRow, styles.totalRowFinal]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Bs {total.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}
