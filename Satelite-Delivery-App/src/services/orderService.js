/**
 * @file src/services/orderService.js
 *
 * Servicio de pedidos — endpoints de Satélite Delivery.
 *
 * Métodos:
 *  - getStores()                   → Store[]
 *  - getStoreProducts(storeId)     → Product[]
 *  - getZones()                    → Zone[]
 *  - createOrder(payload)          → OrderResult
 *  - getOrder(orderId)             → OrderResult
 *  - getMyOrders()                 → OrderResult[]
 *
 * Todos los métodos lanzan un AppError en caso de fallo (ver errorHandler.js).
 */

import client from '../api/client';

// ─── JSDoc Types (espejo del DER) ─────────────────────────────────────────────

/**
 * @typedef {Object} Store
 * @property {number}  id
 * @property {string}  nombre
 * @property {string}  descripcion
 * @property {number}  lat
 * @property {number}  lng
 * @property {boolean} is_active
 */

/**
 * @typedef {Object} Product
 * @property {number}  id
 * @property {number}  tienda_id
 * @property {string}  nombre
 * @property {number}  precio
 * @property {boolean} estado_stock
 */

/**
 * @typedef {Object} Zone
 * @property {number} id
 * @property {string} nombre
 * @property {number} costo_envio
 */

/**
 * @typedef {Object} CreateOrderPayload
 * @property {number}   zona_id
 * @property {string}   referencia_entrega
 * @property {Array<{ producto_id: number, cantidad: number, precio_en_compra: number }>} items
 */

/**
 * @typedef {Object} OrderResult
 * @property {number}  id
 * @property {number}  cliente_id
 * @property {number}  repartidor_id
 * @property {number}  estado_id
 * @property {number}  zona_id
 * @property {string}  referencia_entrega
 * @property {number}  total_precio
 * @property {number}  costo_envio
 * @property {string}  enlace_whatsapp
 * @property {number}  lat
 * @property {number}  lng
 * @property {Array}   items
 */

// ─── Servicio ─────────────────────────────────────────────────────────────────

const orderService = {
  /**
   * Lista todas las tiendas activas.
   * GET /stores
   *
   * @returns {Promise<Store[]>}
   * @throws {AppError}
   */
  async getStores() {
    const { data } = await client.get('/stores');
    return data; // Store[]
  },

  /**
   * Obtiene los productos de una tienda específica.
   * GET /stores/:storeId/products
   *
   * @param {number|string} storeId
   * @returns {Promise<Product[]>}
   * @throws {AppError}
   */
  async getStoreProducts(storeId) {
    const { data } = await client.get(`/stores/${storeId}/products`);
    return data;
  },

  /**
   * Lista las zonas de entrega disponibles.
   * GET /zones
   *
   * @returns {Promise<Zone[]>}
   * @throws {AppError}
   */
  async getZones() {
    const { data } = await client.get('/zones');
    return data;
  },

  /**
   * Crea un nuevo pedido.
   * POST /orders
   *
   * El backend de Laravel retorna el pedido creado con el enlace_whatsapp
   * generado y los campos de rastreo.
   *
   * @param {CreateOrderPayload} payload
   * @returns {Promise<OrderResult>}
   * @throws {AppError}
   */
  async createOrder(payload) {
    const { data } = await client.post('/orders', payload);
    return data;
  },

  /**
   * Obtiene el detalle y estado actual de un pedido.
   * GET /orders/:orderId
   *
   * @param {number|string} orderId
   * @returns {Promise<OrderResult>}
   * @throws {AppError}
   */
  async getOrder(orderId) {
    const { data } = await client.get(`/orders/${orderId}`);
    return data;
  },

  /**
   * Lista el historial de pedidos del usuario autenticado.
   * GET /orders
   *
   * @returns {Promise<OrderResult[]>}
   * @throws {AppError}
   */
  async getMyOrders() {
    const { data } = await client.get('/orders');
    return data;
  },
};

export default orderService;
