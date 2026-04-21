/**
 * Mock Data para Satélite Delivery
 * Basado en el DER oficial y los requerimientos de logística local.
 */

export const MOCK_ZONES = [
    { id: 1, nombre: "Curifema", costo_envio: 7.00 },
    { id: 2, nombre: "Pentaguazú 1", costo_envio: 8.00 },
    { id: 3, nombre: "Pentaguazú 2", costo_envio: 10.00 },
    { id: 4, nombre: "Pentaguazú 3", costo_envio: 12.00 },
    { id: 5, nombre: "Juan Pablo II", costo_envio: 7.00 },
    { id: 6, nombre: "Satélite Centro", costo_envio: 5.00 }
];

export const MOCK_STORES = [
    {
        id: 1,
        nombre: "Pollos El Solar",
        descripcion: "El mejor pollo frito de la zona",
        lat: -17.545678,
        lng: -63.167890,
        is_active: true
    },
    {
        id: 2,
        nombre: "Pizzería La Satelital",
        descripcion: "Pizzas artesanales a la leña",
        lat: -17.548912,
        lng: -63.169012,
        is_active: true
    }
];

export const MOCK_PRODUCTS = [
    { id: 1, tienda_id: 1, nombre: "Cuarto de Pollo", precio: 25.00, estado_stock: true },
    { id: 2, tienda_id: 1, nombre: "Combo Familiar", precio: 85.00, estado_stock: true },
    { id: 3, tienda_id: 2, nombre: "Pizza Pepperoni Grande", precio: 60.00, estado_stock: true }
];

export const MOCK_ORDERS = [
    {
        id: 42,
        cliente_id: 10,
        repartidor_id: 5,
        estado_id: 3, // En Camino
        zona_id: 1,
        referencia_entrega: "Casa de reja negra frente a la tienda de Doña Mary, portón con flores.",
        total_precio: 32.00, // 25 del pollo + 7 de envío (Curifema)
        costo_envio: 7.00,
        enlace_whatsapp: "https://wa.me/59168603014?text=Pedido%2042%20en%20camino",
        lat: -17.543210,
        lng: -63.165432,
        items: [
            { producto_id: 1, cantidad: 1, precio_en_compra: 25.00 }
        ]
    }
];