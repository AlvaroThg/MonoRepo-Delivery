/**
 * @file src/types/models.ts
 *
 * Tipos de dominio centralizados para Satélite Delivery.
 * Coinciden exactamente con el DER y los responses de la API Laravel.
 *
 * Importar desde aquí en lugar de desde useCheckout o mockData.
 */

// ─── Catálogo ─────────────────────────────────────────────────────────────────

export interface Zone {
  id: number;
  /** Nombre del barrio / sector */
  nombre: string;
  /** Costo de envío en Bs */
  costo_envio: number;
}

export interface Store {
  id: number;
  nombre: string;
  descripcion: string;
  lat: number;
  lng: number;
  is_active: boolean;
  /** URL de imagen (opcional, se añade cuando la API la incluya) */
  imagen_url?: string;
  /** Categoría o tipo de tienda (opcional) */
  categoria?: string;
}

export interface Product {
  id: number;
  tienda_id: number;
  nombre: string;
  precio: number;
  estado_stock: boolean;
}

// ─── Carrito ──────────────────────────────────────────────────────────────────

export interface CartItem extends Product {
  /** Unidades en carrito */
  cantidad: number;
}

// ─── Pedido ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  producto_id: number;
  cantidad: number;
  precio_en_compra: number;
}

export interface OrderResult {
  id: number;
  cliente_id: number;
  repartidor_id: number;
  estado_id: number;
  zona_id: number;
  referencia_entrega: string;
  total_precio: number;
  costo_envio: number;
  enlace_whatsapp: string;
  lat: number;
  lng: number;
  items: OrderItem[];
}

// ─── Formulario ───────────────────────────────────────────────────────────────

export interface CheckoutErrors {
  zona?: string;
  referenciaEntrega?: string;
  cart?: string;
}
