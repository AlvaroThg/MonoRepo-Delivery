/**
 * @file OrderTrackingScreen.tsx
 * Seguimiento en tiempo real de un pedido — recibe orderId por params.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { contactDriver } from '../../utils/whatsapp';

type Props = NativeStackScreenProps<AppStackParamList, 'OrderTracking'>;

const STEPS = [
  { label: 'Pedido recibido',     done: true },
  { label: 'Preparando pedido',   done: true },
  { label: 'En camino',           done: true }, // Changed to true to simulate driver assigned
  { label: 'Entregado',           done: false },
];

export default function OrderTrackingScreen({ route }: Props) {
  const { orderId } = route.params;

  // Mock data for the driver
  const isDriverAssigned = STEPS.find(s => s.label === 'En camino')?.done;
  const mockDriverPhone = '+59170000000';
  const mockDeliveryReference = 'Frente al parque principal';

  const handleContactDriver = () => {
    contactDriver(mockDriverPhone, orderId, mockDeliveryReference);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.emoji}>📡</Text>
      <Text style={styles.title}>Seguimiento</Text>
      <Text style={styles.orderId}>Pedido #{orderId}</Text>

      <View style={styles.steps}>
        {STEPS.map((step, index) => (
          <View key={index} style={styles.step}>
            <View style={[styles.dot, step.done && styles.dotDone]} />
            <Text style={[styles.stepLabel, step.done && styles.stepLabelDone]}>
              {step.label}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.hint}>
        Esta pantalla mostrará actualizaciones en tiempo real vía WebSocket o polling.
      </Text>

      {isDriverAssigned && (
        <TouchableOpacity
          style={styles.whatsappBtn}
          onPress={handleContactDriver}
          activeOpacity={0.85}
        >
          <Text style={styles.whatsappBtnText}>Contactar al Repartidor 💬</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    alignItems: 'center',
    padding: 28,
    paddingTop: 40,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1D26',
  },
  orderId: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 32,
  },
  steps: {
    width: '100%',
    gap: 0,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F3',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E5E7EB',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  dotDone: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  stepLabel: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  stepLabelDone: {
    color: '#1A1D26',
    fontWeight: '700',
  },
  hint: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 20,
  },
  whatsappBtn: {
    marginTop: 24,
    backgroundColor: '#25D366', // WhatsApp green
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  whatsappBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
