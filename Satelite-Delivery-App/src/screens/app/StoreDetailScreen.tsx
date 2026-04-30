import React, { useEffect, useMemo, useState } from 'react';
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
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';
import type { Product, Store } from '../../types/models';

type Props = NativeStackScreenProps<AppStackParamList, 'StoreDetail'>;

export default function StoreDetailScreen({ navigation, route }: Props) {
  const { storeId, storeName } = route.params;
  const { store: cartStore, items, totalItems, addProduct } = useCart();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setError(null);
        setLoading(true);

        const [storeDetail, storeProducts] = await Promise.all([
          orderService.getStore(storeId),
          orderService.getStoreProducts(storeId),
        ]);

        if (!active) {
          return;
        }

        setStore(storeDetail);
        setProducts(storeProducts);
      } catch (err: any) {
        if (active) {
          setError(err?.message ?? 'No se pudo cargar esta tienda.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [storeId]);

  const cartForThisStore = useMemo(() => {
    if (!cartStore || cartStore.id !== Number(storeId)) {
      return 0;
    }

    return items.reduce((sum, item) => sum + item.cantidad, 0);
  }, [cartStore, items, storeId]);

  const handleAddProduct = (product: Product) => {
    if (!store) {
      return;
    }

    const replacedStore = addProduct(store, product);

    if (replacedStore) {
      setInfo('Tu carrito cambio a esta tienda para mantener un pedido real por comercio.');
      return;
    }

    setInfo(`Agregaste ${product.nombre} al carrito.`);
  };

  return (
    <View style={styles.root}>
      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.stateText}>Cargando catalogo...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>{store?.nombre ?? storeName}</Text>
            <Text style={styles.sub}>{store?.descripcion}</Text>
            <Text style={styles.meta}>
              {cartForThisStore} productos en el carrito de esta tienda
            </Text>
            {!!info && <Text style={styles.info}>{info}</Text>}
          </View>

          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Esta tienda todavia no tiene productos publicados.
              </Text>
            }
            renderItem={({ item }) => (
              <View style={styles.productCard}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.nombre}</Text>
                  <Text style={styles.productDescription}>
                    {item.descripcion}
                  </Text>
                  <Text style={styles.productPrice}>
                    Bs {item.precio.toFixed(2)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => handleAddProduct(item)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.addBtnText}>Agregar</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>
              Ver mi Carrito ({totalItems}) 🛒
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  stateText: {
    color: '#4B5563',
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1D26',
  },
  sub: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 20,
  },
  meta: {
    marginTop: 10,
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 13,
  },
  info: {
    marginTop: 10,
    color: '#92400E',
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 12,
    lineHeight: 20,
  },
  error: {
    fontSize: 15,
    color: '#DC2626',
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
    paddingRight: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1D26',
  },
  productDescription: {
    marginTop: 6,
    color: '#6B7280',
    lineHeight: 20,
    fontSize: 13,
  },
  productPrice: {
    marginTop: 10,
    color: '#111827',
    fontWeight: '700',
    fontSize: 15,
  },
  addBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  btn: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
    backgroundColor: '#3B82F6',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
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
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    paddingTop: 32,
    lineHeight: 22,
  },
});
