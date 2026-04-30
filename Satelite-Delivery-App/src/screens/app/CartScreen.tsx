import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import CartSummary from '../../components/checkout/CartSummary';
import { useCart } from '../../context/CartContext';

type Props = NativeStackScreenProps<AppStackParamList, 'Cart'>;

export default function CartScreen({ navigation }: Props) {
  const { items, subtotal, updateQuantity, lastOrderId, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <View style={styles.root}>
        <Text style={styles.emoji}>🛒</Text>
        <Text style={styles.title}>Tu carrito esta vacio</Text>
        <Text style={styles.hint}>
          Agrega productos desde una tienda para crear un pedido real.
        </Text>

        {lastOrderId && (
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() =>
              navigation.navigate('OrderTracking', { orderId: lastOrderId })
            }
            activeOpacity={0.85}
          >
            <Text style={styles.btnSecondaryText}>Ver ultimo pedido 📡</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.fullRoot}>
      <View style={styles.content}>
        <Text style={styles.title}>Mi Carrito</Text>
        <Text style={styles.hint}>
          Ajusta cantidades antes de pasar al checkout.
        </Text>

        <CartSummary
          items={items}
          subtotal={subtotal}
          deliveryFee={0}
          total={subtotal}
          onUpdateQuantity={updateQuantity}
        />
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Checkout')}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Proceder al Checkout →</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={clearCart}
        activeOpacity={0.85}
      >
        <Text style={styles.btnSecondaryText}>Vaciar carrito</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fullRoot: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: 20,
    justifyContent: 'space-between',
  },
  root: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1D26',
  },
  content: {
    gap: 12,
  },
  hint: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 22,
  },
  btn: {
    backgroundColor: '#3B82F6',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  btnSecondary: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 15,
  },
});
