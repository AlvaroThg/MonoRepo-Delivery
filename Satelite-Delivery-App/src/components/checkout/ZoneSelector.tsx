/**
 * @file ZoneSelector.tsx
 *
 * Dropdown tipo bottom-sheet para seleccionar la zona de entrega.
 *
 * Props:
 *  - zones          : Zone[]            — lista de zonas (de API o mock)
 *  - selectedZone   : Zone | null       — zona actualmente seleccionada
 *  - onSelect       : (zone) => void    — callback al seleccionar
 *  - error?         : string            — mensaje de validación
 *
 * Lógica de costo: cada zona ya trae `costo_envio` desde el backend.
 * El componente no calcula; solo muestra lo que recibe por props.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ListRenderItemInfo,
  Animated,
  Pressable,
} from 'react-native';
import type { Zone } from '../../types/models';
import { styles } from './ZoneSelector.styles';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Mapa de rangos de costo → emoji descriptivo */
function getZoneEmoji(costoEnvio: number): string {
  if (costoEnvio <= 5)  return '🏠';  // Satélite Centro (cerquita)
  if (costoEnvio <= 8)  return '🛵';  // Radio medio
  if (costoEnvio <= 10) return '🏘️'; // Un poco más lejos
  return '🗺️';                        // Zona alejada
}

/** Etiqueta de distancia según costo */
function getDistanceLabel(costoEnvio: number): string {
  if (costoEnvio <= 5)  return 'Zona cercana';
  if (costoEnvio <= 8)  return 'Zona media';
  if (costoEnvio <= 10) return 'Zona alejada';
  return 'Zona lejana';
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ZoneSelectorProps {
  zones: Zone[];
  selectedZone: Zone | null;
  onSelect: (zone: Zone) => void;
  error?: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ZoneSelector({
  zones,
  selectedZone,
  onSelect,
  error,
}: ZoneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = useCallback(
    (zone: Zone) => {
      onSelect(zone);
      setIsOpen(false);
    },
    [onSelect]
  );

  // ── Render de cada opción del dropdown ───────────────────────
  const renderOption = useCallback(
    ({ item, index }: ListRenderItemInfo<Zone>) => {
      const isSelected = selectedZone?.id === item.id;
      const emoji = getZoneEmoji(item.costo_envio);

      return (
        <TouchableOpacity
          style={[styles.option, isSelected && styles.optionSelected]}
          onPress={() => handleSelect(item)}
          activeOpacity={0.7}
          accessibilityLabel={`Zona ${item.nombre}, costo de envío Bs ${item.costo_envio}`}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
        >
          {/* Icono */}
          <View style={[styles.optionIconBox, isSelected && styles.optionIconBoxSelected]}>
            <Text style={styles.optionIcon}>{emoji}</Text>
          </View>

          {/* Nombre + distancia */}
          <View style={styles.optionTextBlock}>
            <Text style={[styles.optionName, isSelected && styles.optionNameSelected]}>
              {item.nombre}
            </Text>
            <Text style={[styles.optionPrice, isSelected && styles.optionPriceSelected]}>
              {getDistanceLabel(item.costo_envio)}
            </Text>
          </View>

          {/* Badge de precio */}
          <View style={[styles.priceBadge, isSelected && styles.priceBadgeSelected]}>
            <Text style={[styles.priceBadgeText, isSelected && styles.priceBadgeTextSelected]}>
              Bs {item.costo_envio.toFixed(2)}
            </Text>
          </View>

          {/* Check de selección */}
          {isSelected && <Text style={styles.optionCheck}>✓</Text>}
        </TouchableOpacity>
      );
    },
    [selectedZone, handleSelect]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Zona de Entrega</Text>

      {/* ── Botón trigger ── */}
      <TouchableOpacity
        style={[
          styles.trigger,
          isOpen       && styles.triggerActive,
          !!error      && styles.triggerError,
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
        accessibilityLabel="Seleccionar zona de entrega"
        accessibilityRole="combobox"
        accessibilityState={{ expanded: isOpen }}
      >
        <View style={styles.triggerLeft}>
          {selectedZone ? (
            <>
              <Text style={styles.triggerSelectedName}>
                {getZoneEmoji(selectedZone.costo_envio)}{' '}{selectedZone.nombre}
              </Text>
              <Text style={styles.triggerSelectedPrice}>
                Envío: Bs {selectedZone.costo_envio.toFixed(2)}
              </Text>
            </>
          ) : (
            <Text style={styles.triggerPlaceholder}>
              Selecciona tu zona de entrega...
            </Text>
          )}
        </View>
        <Text style={styles.triggerIcon}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Error de validación */}
      {!!error && <Text style={styles.error}>{error}</Text>}

      {/* ── Bottom-sheet modal ── */}
      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
        statusBarTranslucent
      >
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          {/* Evitamos que el tap dentro del sheet cierre el modal */}
          <Pressable style={styles.sheet} onPress={() => {}}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Elige tu zona</Text>
              <TouchableOpacity
                style={styles.sheetCloseBtn}
                onPress={() => setIsOpen(false)}
              >
                <Text style={styles.sheetCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSubtitle}>
              El costo de envío varía según la distancia al punto de entrega.
            </Text>

            {/* Lista de zonas */}
            <FlatList
              data={zones}
              renderItem={renderOption}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
