import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
} from 'react-native';
import { OrderResult } from '../../hooks/useCheckout';

interface OrderConfirmationProps {
  visible: boolean;
  order: OrderResult | null;
  onClose: () => void;
}

/**
 * Modal de confirmación de pedido con resumen y botón de WhatsApp.
 */
export default function OrderConfirmation({
  visible,
  order,
  onClose,
}: OrderConfirmationProps) {
  if (!order) return null;

  const handleOpenWhatsApp = async (): Promise<void> => {
    try {
      const supported = await Linking.canOpenURL(order.enlace_whatsapp);
      if (supported) {
        await Linking.openURL(order.enlace_whatsapp);
      }
    } catch (err) {
      console.warn('No se pudo abrir WhatsApp:', err);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Icono de éxito */}
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>✓</Text>
          </View>

          <Text style={styles.title}>¡Pedido Creado!</Text>
          <Text style={styles.subtitle}>
            Tu pedido #{order.id} fue registrado exitosamente.
          </Text>

          {/* Resumen rápido */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>
                Bs {order.total_precio?.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Envío</Text>
              <Text style={styles.summaryValue}>
                Bs {order.costo_envio?.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Referencia */}
          <View style={styles.refBox}>
            <Text style={styles.refLabel}>Referencia de entrega</Text>
            <Text style={styles.refText}>{order.referencia_entrega}</Text>
          </View>

          {/* Botón WhatsApp */}
          <TouchableOpacity
            style={styles.whatsappBtn}
            onPress={handleOpenWhatsApp}
            activeOpacity={0.8}
          >
            <Text style={styles.whatsappBtnText}>💬  Abrir WhatsApp</Text>
          </TouchableOpacity>

          {/* Botón Cerrar */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeBtnText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 32,
    color: '#10B981',
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1D26',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryBox: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1D26',
  },
  refBox: {
    width: '100%',
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
  },
  refLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  refText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  whatsappBtn: {
    width: '100%',
    backgroundColor: '#25D366',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  whatsappBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    paddingVertical: 12,
  },
  closeBtnText: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '600',
  },
});
