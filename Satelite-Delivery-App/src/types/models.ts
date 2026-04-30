export type OrderStatus = 'pending' | 'accepted' | 'on_way' | 'delivered';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface Zone {
  id: number;
  nombre: string;
  lat: number;
  lng: number;
  costo_envio: number;
}

export interface Store {
  id: number;
  nombre: string;
  descripcion: string;
  lat: number;
  lng: number;
  is_active: boolean;
  imagen_url?: string | null;
  categoria?: string;
  owner_name?: string;
}

export interface Product {
  id: number;
  tienda_id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url?: string | null;
  estado_stock: boolean;
}

export interface CartItem extends Product {
  cantidad: number;
}

export interface OrderResult {
  id: number;
  estado: OrderStatus;
  subtotal: number;
  costo_envio: number;
  total_precio: number;
  lat: number;
  lng: number;
  referencia_entrega: string;
  cliente?: AuthUser | null;
  tienda?: Store | null;
  repartidor?: AuthUser | null;
  created_at: string;
  updated_at: string;
}

export interface CheckoutErrors {
  zona?: string;
  referenciaEntrega?: string;
  cart?: string;
  general?: string;
}
