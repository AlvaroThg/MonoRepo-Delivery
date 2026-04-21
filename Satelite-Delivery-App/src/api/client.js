/**
 * @file src/api/client.js
 *
 * Instancia centralizada de Axios para Satélite Delivery.
 *
 * Características:
 *  - baseURL leída desde la variable de entorno API_BASE_URL (.env → @env)
 *  - Request interceptor: adjunta automáticamente el Bearer Token de Sanctum
 *    almacenado en AsyncStorage.
 *  - Response interceptor: manejo centralizado de errores (401, 422, 5xx, red).
 *
 * Uso:
 *   import client from '../api/client';
 *   const { data } = await client.get('/stores');
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_TIMEOUT } from '@env';
import { handleApiError } from './errorHandler';

// ─── Storage key (token de Sanctum) ──────────────────────────────────────────

export const TOKEN_KEY = '@satelite:sanctum_token';

// ─── Instancia base ───────────────────────────────────────────────────────────

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number(API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request interceptor — adjunta Bearer Token ──────────────────────────────

client.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Si AsyncStorage falla no bloqueamos la petición
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — manejo centralizado de errores ───────────────────

client.interceptors.response.use(
  // Respuesta exitosa: pasamos directo
  (response) => response,

  // Error HTTP o de red
  async (error) => {
    return Promise.reject(handleApiError(error));
  }
);

export default client;
