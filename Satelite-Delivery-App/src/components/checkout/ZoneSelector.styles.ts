/**
 * @file ZoneSelector.styles.ts
 * Estilos separados del componente ZoneSelector.
 */

import { StyleSheet, Platform } from 'react-native';

// ─── Design tokens ────────────────────────────────────────────────────────────
const COLOR = {
  primary:     '#3B82F6',
  primaryBg:   '#EFF6FF',
  primaryText: '#1E40AF',
  surface:     '#FFFFFF',
  surfaceAlt:  '#F9FAFB',
  border:      '#E5E7EB',
  text:        '#1A1D26',
  textMuted:   '#6B7280',
  textLight:   '#9CA3AF',
  error:       '#EF4444',
  errorBg:     '#FEF2F2',
  success:     '#10B981',
  overlay:     'rgba(0, 0, 0, 0.45)',
  chip:        '#F3F4F6',
} as const;

const RADIUS = { sm: 10, md: 14, lg: 18, xl: 22 } as const;

// ─── Styles ───────────────────────────────────────────────────────────────────

export const styles = StyleSheet.create({
  // Wrapper externo
  container: {
    marginBottom: 20,
  },

  // Etiqueta superior
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: COLOR.text,
    marginBottom: 8,
  },

  // Botón que abre el dropdown
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.surface,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLOR.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  triggerActive: {
    borderColor: COLOR.primary,
    backgroundColor: COLOR.primaryBg,
  },
  triggerError: {
    borderColor: COLOR.error,
    backgroundColor: COLOR.errorBg,
  },
  triggerLeft: {
    flex: 1,
  },
  triggerPlaceholder: {
    fontSize: 15,
    color: COLOR.textLight,
  },
  triggerSelectedName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLOR.text,
  },
  triggerSelectedPrice: {
    fontSize: 13,
    color: COLOR.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  triggerIcon: {
    fontSize: 18,
    color: COLOR.textMuted,
    marginLeft: 8,
  },

  // ── Modal overlay ────────────────────────────────────────────
  overlay: {
    flex: 1,
    backgroundColor: COLOR.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLOR.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingBottom: 32,
    maxHeight: '70%',
  },

  // Header del sheet
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLOR.text,
  },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLOR.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCloseText: {
    fontSize: 16,
    color: COLOR.textMuted,
    fontWeight: '700',
  },

  // Subtítulo informativo
  sheetSubtitle: {
    fontSize: 13,
    color: COLOR.textMuted,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },

  // Cada opción de zona
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.surfaceAlt,
  },
  optionSelected: {
    backgroundColor: COLOR.primaryBg,
  },
  optionIconBox: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.chip,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionIconBoxSelected: {
    backgroundColor: COLOR.primary,
  },
  optionIcon: {
    fontSize: 20,
  },
  optionTextBlock: {
    flex: 1,
  },
  optionName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLOR.text,
  },
  optionNameSelected: {
    color: COLOR.primaryText,
    fontWeight: '700',
  },
  optionPrice: {
    fontSize: 13,
    color: COLOR.textMuted,
    marginTop: 2,
  },
  optionPriceSelected: {
    color: COLOR.primary,
    fontWeight: '600',
  },
  optionCheck: {
    fontSize: 18,
    color: COLOR.primary,
    fontWeight: '700',
  },

  // Precio destacado a la derecha
  priceBadge: {
    backgroundColor: COLOR.chip,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 10,
  },
  priceBadgeSelected: {
    backgroundColor: COLOR.primary,
  },
  priceBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLOR.textMuted,
  },
  priceBadgeTextSelected: {
    color: '#FFFFFF',
  },

  // Error
  error: {
    color: COLOR.error,
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500',
  },
});

export { COLOR, RADIUS };
