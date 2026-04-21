import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useCheckout } from '../hooks/useCheckout';
import ZoneSelector from '../components/checkout/ZoneSelector';
import CartSummary from '../components/checkout/CartSummary';
import OrderConfirmation from '../components/checkout/OrderConfirmation';

/**
 * Pantalla de Checkout — compone zona, referencia, carrito y confirmación.
 */
export default function CheckoutScreen() {
  const {
    zones,
    selectedZone,
    referenciaEntrega,
    setReferenciaEntrega,
    cartItems,
    isSubmitting,
    errors,
    orderResult,
    subtotal,
    deliveryFee,
    total,
    selectZone,
    updateQuantity,
    submitOrder,
    resetOrder,
  } = useCheckout();

  const handleSubmit = async (): Promise<void> => {
    await submitOrder();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Checkout</Text>
          <Text style={styles.headerSubtitle}>
            Confirma tu pedido y zona de entrega
          </Text>
        </View>

        {/* Selector de Zona */}
        <ZoneSelector
          zones={zones}
          selectedZone={selectedZone}
          onSelect={selectZone}
          error={errors.zona}
        />

        {/* Referencia de Entrega */}
        <View style={styles.section}>
          <Text style={styles.label}>Referencia de Entrega</Text>
          <Text style={styles.hint}>
            Describe cómo llegar a tu casa (ej: casa de reja verde frente a la cancha)
          </Text>
          <TextInput
            style={[
              styles.textArea,
              errors.referenciaEntrega && styles.textAreaError,
            ]}
            placeholder="Ej: Casa de reja negra frente a la tienda de Doña Mary..."
            placeholderTextColor="#C4C9D4"
            value={referenciaEntrega}
            onChangeText={setReferenciaEntrega}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.referenciaEntrega && (
            <Text style={styles.error}>{errors.referenciaEntrega}</Text>
          )}
        </View>

        {/* Resumen del Carrito */}
        <CartSummary
          items={cartItems}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          onUpdateQuantity={updateQuantity}
          error={errors.cart}
        />

        {/* Botón Confirmar */}
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitBtnText}>Confirmar Pedido</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal de Confirmación */}
      <OrderConfirmation
        visible={!!orderResult}
        order={orderResult}
        onClose={resetOrder}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1D26',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1D26',
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 10,
    lineHeight: 18,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    fontSize: 14,
    color: '#374151',
    minHeight: 100,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    lineHeight: 20,
  },
  textAreaError: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF5F5',
  },
  error: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500',
  },
  submitBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bottomSpacer: {
    height: 40,
  },
});
