/**
 * @file CartSummary.styles.ts
 * Estilos separados del componente CartSummary.
 */

import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  // Tarjeta contenedora
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },

  // Header de la sección
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1D26',
  },
  itemCount: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Separador visual entre secciones
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },

  // ── Fila de producto ─────────────────────────────────────────

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  rowLast: {
    borderBottomWidth: 0,
  },

  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  productPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },

  // Badge de sin stock
  outOfStockBadge: {
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  outOfStockText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
  },

  // ── Controles de cantidad ────────────────────────────────────

  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 3,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: { elevation: 1 },
    }),
  },
  qtyBtnDisabled: {
    opacity: 0.35,
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    lineHeight: 18,
  },
  qtyValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1D26',
    minWidth: 26,
    textAlign: 'center',
  },
  qtyValueZero: {
    color: '#D1D5DB',
  },

  // Subtotal por línea
  lineTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1D26',
    minWidth: 72,
    textAlign: 'right',
  },
  lineTotalZero: {
    color: '#D1D5DB',
  },

  // Error del carrito
  error: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
    marginBottom: 8,
  },

  // ── Desglose de totales ──────────────────────────────────────

  totalsSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalsLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  totalsValueFree: {
    color: '#10B981',
    fontWeight: '700',
  },
  totalsValuePending: {
    color: '#D1D5DB',
    fontStyle: 'italic',
  },

  // Fila total resaltada
  totalRowFinal: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1D26',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3B82F6',
  },
});
