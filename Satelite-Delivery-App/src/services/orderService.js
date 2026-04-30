import client from '../api/client';

function unwrapData(payload) {
  return payload?.data ?? payload;
}

function mapUser(payload) {
  if (!payload) {
    return null;
  }

  const user = unwrapData(payload);

  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

function mapStore(payload) {
  const store = unwrapData(payload);
  const ownerName = store.owner?.name;

  return {
    id: Number(store.id),
    nombre: store.name,
    descripcion: ownerName
      ? `Atendido por ${ownerName}. Pedido rapido en tu zona.`
      : 'Disponible para entrega en Satelite Norte.',
    lat: Number(store.lat),
    lng: Number(store.lng),
    is_active: store.is_active ?? true,
    imagen_url: store.image_url ?? null,
    owner_name: ownerName,
  };
}

function mapProduct(payload) {
  const product = unwrapData(payload);

  return {
    id: Number(product.id),
    tienda_id: Number(product.store_id),
    nombre: product.name,
    descripcion: product.description ?? 'Producto disponible para entrega.',
    precio: Number(product.price),
    imagen_url: product.image_url ?? null,
    estado_stock: product.in_stock ?? true,
  };
}

function mapZone(payload) {
  const zone = unwrapData(payload);

  return {
    id: Number(zone.id),
    nombre: zone.name,
    lat: Number(zone.lat),
    lng: Number(zone.lng),
    costo_envio: 0,
  };
}

function mapOrder(payload) {
  const order = unwrapData(payload);

  return {
    id: Number(order.id),
    estado: order.status,
    subtotal: Number(order.subtotal),
    costo_envio: Number(order.delivery_fee),
    total_precio: Number(order.total),
    lat: Number(order.lat),
    lng: Number(order.lng),
    referencia_entrega: order.reference_text,
    cliente: mapUser(order.client),
    tienda: order.store ? mapStore(order.store) : null,
    repartidor: mapUser(order.driver),
    created_at: order.created_at,
    updated_at: order.updated_at,
  };
}

const orderService = {
  async getStores() {
    const { data } = await client.get('/stores');
    return unwrapData(data).map(mapStore);
  },

  async getStore(storeId) {
    const { data } = await client.get(`/stores/${storeId}`);
    const store = unwrapData(data);

    return {
      ...mapStore(store),
      products: Array.isArray(store.products)
        ? store.products.map(mapProduct)
        : [],
    };
  },

  async getStoreProducts(storeId) {
    const { data } = await client.get(`/stores/${storeId}/products`);
    return unwrapData(data).map(mapProduct);
  },

  async getZones() {
    const { data } = await client.get('/zones');
    return unwrapData(data).map(mapZone);
  },

  async createOrder({ storeId, subtotal, lat, lng, referenceText }) {
    const { data } = await client.post('/orders', {
      store_id: storeId,
      subtotal,
      lat,
      lng,
      reference_text: referenceText,
    });

    return mapOrder(data);
  },

  async getOrder(orderId) {
    const { data } = await client.get(`/orders/${orderId}`);
    return mapOrder(data);
  },

  async getMyOrders() {
    const { data } = await client.get('/orders');
    return unwrapData(data).map(mapOrder);
  },
};

export default orderService;
