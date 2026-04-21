/**
 * @file src/services/authService.js
 *
 * Servicio de autenticación — Laravel Sanctum.
 *
 * Métodos:
 *  - login(phone, password)  → { user, token }
 *  - register(data)          → { user, token }
 *  - logout()                → void (revoca token en backend y limpia AsyncStorage)
 *  - getProfile()            → AuthUser
 *
 * El token se persiste en AsyncStorage en TOKEN_KEY para que el interceptor
 * de client.js lo adjunte en cada petición posterior.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import client, { TOKEN_KEY } from '../api/client';

// ─── Helpers internos ─────────────────────────────────────────────────────────

/**
 * Guarda el token de Sanctum en AsyncStorage.
 * @param {string} token
 */
async function persistToken(token) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

/**
 * Elimina el token de AsyncStorage.
 */
async function clearToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

const authService = {
  /**
   * Inicia sesión con teléfono + contraseña.
   * POST /auth/login
   *
   * @param {{ phone: string, password: string }} credentials
   * @returns {Promise<{ user: object, token: string }>}
   * @throws {AppError}
   */
  async login({ phone, password }) {
    const { data } = await client.post('/auth/login', { phone, password });
    // Laravel Sanctum responde: { user: {...}, token: "..." }
    await persistToken(data.token);
    return data; // { user, token }
  },

  /**
   * Registra un nuevo usuario.
   * POST /auth/register
   *
   * @param {{ name: string, phone: string, password: string }} payload
   * @returns {Promise<{ user: object, token: string }>}
   * @throws {AppError}
   */
  async register({ name, phone, password }) {
    const { data } = await client.post('/auth/register', {
      name,
      phone,
      password,
    });
    await persistToken(data.token);
    return data;
  },

  /**
   * Cierra la sesión activa.
   * POST /auth/logout  (revoca el token en Sanctum)
   * Elimina el token de AsyncStorage independientemente del resultado.
   *
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await client.post('/auth/logout');
    } finally {
      // Siempre limpiamos localmente, aunque el backend falle
      await clearToken();
    }
  },

  /**
   * Obtiene el perfil del usuario autenticado.
   * GET /auth/me
   *
   * @returns {Promise<object>} AuthUser
   * @throws {AppError}
   */
  async getProfile() {
    const { data } = await client.get('/auth/me');
    return data;
  },

  /**
   * Lee el token guardado localmente (útil para restaurar sesión al iniciar la app).
   * @returns {Promise<string|null>}
   */
  async getSavedToken() {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
};

export default authService;
