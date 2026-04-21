/**
 * @file StoreCard.styles.ts
 * Estilos separados del componente StoreCard.
 */

import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  // Tarjeta principal
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },

  // Franja de color superior (accent)
  accentBar: {
    height: 4,
    backgroundColor: '#3B82F6',
  },

  // Cuerpo de la tarjeta
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  // Avatar / emoji de la tienda
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarEmoji: {
    fontSize: 28,
  },

  // Bloque de texto
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1D26',
    marginBottom: 3,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },

  // Categoría badge
  category: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  // Flecha indicadora
  arrow: {
    fontSize: 22,
    color: '#D1D5DB',
    marginLeft: 8,
  },

  // Badge de estado activo / inactivo
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusBadgeInactive: {
    backgroundColor: '#F3F4F6',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 5,
  },
  statusDotInactive: {
    backgroundColor: '#9CA3AF',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  statusTextInactive: {
    color: '#9CA3AF',
  },

  // Estado: inactiva (overlay atenuado)
  inactiveOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 18,
  },
});
