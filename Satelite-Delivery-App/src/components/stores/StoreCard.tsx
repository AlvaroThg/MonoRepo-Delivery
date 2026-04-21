/**
 * @file StoreCard.tsx
 *
 * Tarjeta de tienda para listas de comercios disponibles.
 *
 * Props:
 *  - store      : Store              — datos de la tienda (de API o mock)
 *  - onPress    : () => void         — callback al presionar
 *  - category?  : string            — categoría opcional para el badge
 *  - emoji?     : string            — emoji representativo (default: 🏪)
 *
 * Listo para conectar a orderService.getStores():
 *   const stores = await orderService.getStores();
 *   <StoreCard store={store} onPress={() => navigate('StoreDetail', { storeId: store.id })} />
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import type { Store } from '../../types/models';
import { styles } from './StoreCard.styles';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Elige un color de acento distinto por ID para hacer la lista más visual */
const ACCENT_COLORS = [
  '#3B82F6', // azul
  '#8B5CF6', // violeta
  '#EC4899', // rosa
  '#F59E0B', // ámbar
  '#10B981', // verde
  '#EF4444', // rojo
];

function getAccentColor(id: number): string {
  return ACCENT_COLORS[id % ACCENT_COLORS.length];
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface StoreCardProps {
  store: Store;
  onPress: () => void;
  /** Emoji representativo de la tienda. Default: 🏪 */
  emoji?: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function StoreCard({ store, onPress, emoji = '🏪' }: StoreCardProps) {
  const accentColor = getAccentColor(store.id);
  const isActive = store.is_active;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={isActive ? onPress : undefined}
      activeOpacity={0.85}
      disabled={!isActive}
      accessibilityLabel={`Tienda ${store.nombre}. ${isActive ? 'Disponible' : 'No disponible'}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isActive }}
    >
      {/* Franja de color superior */}
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

      {/* Cuerpo */}
      <View style={styles.body}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: `${accentColor}18` }]}>
          <Text style={styles.avatarEmoji}>{emoji}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {store.nombre}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {store.descripcion}
          </Text>

          {/* Badge de categoría (si la API la provee) */}
          {!!store.categoria && (
            <View style={styles.category}>
              <Text style={styles.categoryText}>{store.categoria}</Text>
            </View>
          )}
        </View>

        {/* Flecha → */}
        {isActive && <Text style={styles.arrow}>›</Text>}
      </View>

      {/* Badge de estado */}
      <View style={[styles.statusBadge, !isActive && styles.statusBadgeInactive]}>
        <View style={[styles.statusDot, !isActive && styles.statusDotInactive]} />
        <Text style={[styles.statusText, !isActive && styles.statusTextInactive]}>
          {isActive ? 'Abierto' : 'Cerrado'}
        </Text>
      </View>

      {/* Overlay si está inactiva */}
      {!isActive && <View style={styles.inactiveOverlay} pointerEvents="none" />}
    </TouchableOpacity>
  );
}
