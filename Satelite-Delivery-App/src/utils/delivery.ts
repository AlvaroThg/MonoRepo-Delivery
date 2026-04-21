/**
 * @file delivery.ts
 * Utilidades para cálculo de envíos.
 */

/**
 * Calcula la distancia Euclidiana entre dos puntos geográficos (aproximación en km).
 * @param lat1 Latitud del punto 1
 * @param lng1 Longitud del punto 1
 * @param lat2 Latitud del punto 2
 * @param lng2 Longitud del punto 2
 * @returns Distancia en kilómetros
 */
export function euclideanDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  // d = sqrt((lat2 - lat1)^2 + (lng2 - lng1)^2)
  const dx = lat2 - lat1;
  const dy = lng2 - lng1;
  const distanceInDegrees = Math.sqrt(dx * dx + dy * dy);
  
  // Aproximación: 1 grado geográfico ~ 111.32 km (en el ecuador)
  // Para cálculo "Euclidiano" sobre lat/lng que simule km, usamos un factor multiplicador
  const distanceInKm = distanceInDegrees * 111.32;
  return distanceInKm;
}

/**
 * Aplica los radios de costo según las reglas del negocio:
 *  - Menos de 1.5km = 5 Bs
 *  - Entre 1.5km y 3.5km = 8 Bs
 *  - Más de 3.5km = 12 Bs
 * @param distanceKm Distancia en kilómetros
 * @returns Costo de envío en Bs
 */
export function calculateDeliveryCost(distanceKm: number): number {
  if (distanceKm < 1.5) {
    return 5;
  } else if (distanceKm >= 1.5 && distanceKm <= 3.5) {
    return 8;
  } else {
    return 12;
  }
}
