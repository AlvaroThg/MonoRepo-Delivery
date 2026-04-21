/**
 * @file StoreDetailScreen.tsx
 * Detalle de una tienda — recibe storeId y storeName por params.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'StoreDetail'>;

export default function StoreDetailScreen({ navigation, route }: Props) {
  const { storeId, storeName } = route.params;

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{storeName}</Text>
      <Text style={styles.sub}>ID: {storeId}</Text>
      <Text style={styles.hint}>
        Aquí irá el catálogo de productos de la tienda.
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Cart')}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Ver mi Carrito 🛒</Text>
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1D26',
    textAlign: 'center',
  },
  sub: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 6,
  },
  hint: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
  btn: {
    marginTop: 32,
    backgroundColor: '#3B82F6',
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
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
});
