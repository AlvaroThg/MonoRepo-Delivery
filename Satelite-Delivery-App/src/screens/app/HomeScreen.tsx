import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import StoreCard from '../../components/stores/StoreCard';
import type { Store } from '../../types/models';
import orderService from '../../services/orderService';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStores = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      setError(null);
      setStores(await orderService.getStores());
    } catch (err: any) {
      setError(err?.message ?? 'No se pudieron cargar las tiendas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  return (
    <View style={styles.root}>
      <View style={styles.greet}>
        <Text style={styles.greetText}>
          Hola, <Text style={styles.greetName}>{user?.name ?? 'Usuario'} 👋</Text>
        </Text>
        <Text style={styles.greetSub}>¿Que necesitas hoy?</Text>
        <TouchableOpacity
          style={styles.cartPill}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.85}
        >
          <Text style={styles.cartPillText}>Carrito: {totalItems}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.stateText}>Cargando tiendas...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.stateError}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => loadStores()}>
            <Text style={styles.retryBtnText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={() => loadStores(true)}
          renderItem={({ item }) => (
            <StoreCard
              store={item}
              onPress={() =>
                navigation.navigate('StoreDetail', {
                  storeId: String(item.id),
                  storeName: item.nombre,
                })
              }
            />
          )}
        />
      )}
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
  cartPill: {
    marginTop: 16,
    alignSelf: 'flex-start',
    backgroundColor: '#1F2937',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  cartPillText: {
    color: '#E5E7EB',
    fontWeight: '700',
    fontSize: 13,
  },
  list: {
    padding: 16,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  stateText: {
    color: '#4B5563',
    fontSize: 15,
    fontWeight: '600',
  },
  stateError: {
    color: '#DC2626',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  retryBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
