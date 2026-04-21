/**
 * @file src/api/errorHandler.js
 *
 * Convierte un AxiosError en un objeto AppError uniforme con:
 *  - message   : mensaje legible para el usuario
 *  - status    : código HTTP (o null si es error de red)
 *  - errors    : objeto { field: string[] } para errores de validación (422)
 *  - isNetwork : true si no hubo respuesta del servidor
 *
 * El cliente Axios y los servicios lanzan siempre un AppError,
 * así los componentes y hooks solo necesitan capturar un tipo de error.
 */

/**
 * @typedef {Object} AppError
 * @property {string}              message    - Mensaje amigable
 * @property {number|null}         status     - Código HTTP
 * @property {Record<string,string[]>|null} errors - Errores de validación
 * @property {boolean}             isNetwork  - Sin conexión / timeout
 */

/**
 * Transforma un AxiosError en un AppError.
 * @param {import('axios').AxiosError} error
 * @returns {AppError}
 */
export function handleApiError(error) {
  // ── Sin respuesta: red caída / timeout ────────────────────────────────────
  if (!error.response) {
    return {
      message: 'Sin conexión. Verifica tu internet e inténtalo de nuevo.',
      status: null,
      errors: null,
      isNetwork: true,
    };
  }

  const { status, data } = error.response;

  // ── 401 — No autorizado ───────────────────────────────────────────────────
  if (status === 401) {
    return {
      message: 'Tu sesión expiró. Por favor inicia sesión de nuevo.',
      status,
      errors: null,
      isNetwork: false,
    };
  }

  // ── 403 — Prohibido ───────────────────────────────────────────────────────
  if (status === 403) {
    return {
      message: 'No tienes permiso para realizar esta acción.',
      status,
      errors: null,
      isNetwork: false,
    };
  }

  // ── 404 — No encontrado ───────────────────────────────────────────────────
  if (status === 404) {
    return {
      message: 'El recurso solicitado no fue encontrado.',
      status,
      errors: null,
      isNetwork: false,
    };
  }

  // ── 422 — Validación (Laravel) ────────────────────────────────────────────
  if (status === 422) {
    return {
      message: data?.message ?? 'Hay errores de validación en el formulario.',
      status,
      errors: data?.errors ?? null,   // { field: ['msg1', 'msg2'] }
      isNetwork: false,
    };
  }

  // ── 5xx — Error del servidor ──────────────────────────────────────────────
  if (status >= 500) {
    return {
      message: 'Error en el servidor. Intenta de nuevo más tarde.',
      status,
      errors: null,
      isNetwork: false,
    };
  }

  // ── Cualquier otro error HTTP ─────────────────────────────────────────────
  return {
    message: data?.message ?? `Error inesperado (${status}).`,
    status,
    errors: null,
    isNetwork: false,
  };
}
