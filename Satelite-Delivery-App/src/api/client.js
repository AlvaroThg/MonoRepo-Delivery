/**
 * @file src/api/client.js
 *
 * Instancia centralizada de Axios para Satelite Delivery.
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_TIMEOUT } from '@env';
import { handleApiError } from './errorHandler';

export const TOKEN_KEY = '@satelite:sanctum_token';

const fallbackBaseUrl = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:8080/api`
  : 'http://localhost:8080/api';

const client = axios.create({
  baseURL: API_BASE_URL || fallbackBaseUrl,
  timeout: Number(API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

client.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Si AsyncStorage falla no bloqueamos la peticion.
    }

    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  async (error) => Promise.reject(handleApiError(error))
);

export default client;
