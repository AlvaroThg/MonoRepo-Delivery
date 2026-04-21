/**
 * @file HomeScreen.tsx
 * Pantalla principal del AppStack — lista de tiendas disponibles.
 * Navega a StoreDetail pasando storeId y storeName como params.
 */

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import StoreCard from '../../components/stores/StoreCard';
import type { Store } from '../../types/models';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

// ─── Mock data (reemplazar con orderService.getStores()) ─────────────────────

const STORES: (Store & { emoji: string })[] = [
  { id: 1, nombre: 'Pollos El Solar',       descripcion: 'El mejor pollo frito de la zona', lat: -17.545678, lng: -63.167890, is_active: true,  categoria: 'Comida', emoji: '🍗' },
  { id: 2, nombre: 'Pizzería La Satelital',  descripcion: 'Pizzas artesanales a la leña',   lat: -17.548912, lng: -63.169012, is_active: true,  categoria: 'Comida', emoji: '🍕' },
  { id: 3, nombre: 'Farmacia Salud+',        descripcion: 'Medicamentos y productos de salud', lat: -17.546000, lng: -63.168500, is_active: false, categoria: 'Farmacia', emoji: '💊' },
  { id: 4, nombre: 'Supermercado Central',   descripcion: 'Todo lo que necesitas en un solo lugar', lat: -17.547000, lng: -63.169500, is_active: true, categoria: 'Mercado', emoji: '🛍️' },
];

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();

  return (
    <View style={styles.root}>
      {/* Greeting */}
      <View style={styles.greet}>
        <Text style={styles.greetText}>
          Hola, <Text style={styles.greetName}>{user?.name ?? 'Usuario'} 👋</Text>
        </Text>
        <Text style={styles.greetSub}>¿Qué necesitas hoy?</Text>
      </View>

      {/* Store list */}
      <FlatList
        data={STORES}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <StoreCard
            store={item}
            emoji={item.emoji}
            onPress={() =>
              navigation.navigate('StoreDetail', {
                storeId: String(item.id),
                storeName: item.nombre,
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  greet: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#0F1117',
  },
  greetText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  greetName: {
    color: '#3B82F6',
  },
  greetSub: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
});

