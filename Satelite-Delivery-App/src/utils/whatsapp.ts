/**
 * @file whatsapp.ts
 * Utilidades para la integración con WhatsApp.
 */

import { Linking, Platform } from 'react-native';

/**
 * Abre la app de WhatsApp para contactar al repartidor con un mensaje predefinido.
 * @param driverPhone Teléfono del repartidor (con código de país, ej: +591...)
 * @param orderId ID del pedido
 * @param reference Texto de referencia de entrega del cliente
 */
export async function contactDriver(driverPhone: string, orderId: string, reference: string): Promise<void> {
  const message = `Hola, soy tu cliente del pedido #${orderId}. Estoy en la referencia: ${reference}. ¿A qué distancia estás?`;
  
  // Limpiamos el número por si viene con espacios o signos (mantenemos solo el + inicial o dígitos)
  const cleanPhone = driverPhone.replace(/[^\d+]/g, '');
  
  // wa.me URL scheme. Encodeamos el mensaje para que sea válido en la URL
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error('No se puede abrir WhatsApp, asegúrate de que esté instalado.');
      // En un entorno de producción, aquí podrías lanzar un AppError o mostrar un Toast/Alert
    }
  } catch (error) {
    console.error('Error al intentar abrir WhatsApp:', error);
  }
}
