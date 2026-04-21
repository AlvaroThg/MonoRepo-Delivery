/**
 * @file CartScreen.tsx
 * Pantalla del carrito — AppStack.
 * Navega al Checkout o al seguimiento de una orden existente.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'Cart'>;

export default function CartScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <Text style={styles.emoji}>🛒</Text>
      <Text style={styles.title}>Mi Carrito</Text>
      <Text style={styles.hint}>
        Aquí aparecerán los productos agregados desde las tiendas.
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Checkout')}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Proceder al Checkout →</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() =>
          navigation.navigate('OrderTracking', { orderId: 'order-001' })
        }
        activeOpacity={0.85}
      >
        <Text style={styles.btnSecondaryText}>Ver último pedido 📡</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  hint: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  btn: {
    marginTop: 32,
    backgroundColor: '#3B82F6',
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
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
  },
  btnSecondaryText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 15,
  },
});
