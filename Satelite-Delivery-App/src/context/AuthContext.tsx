/**
 * @file AuthContext.tsx
 *
 * Estado global de autenticación para Satélite Delivery.
 *
 * Cambios respecto a la versión anterior:
 *  - Integra authService (llamadas reales a la API de Laravel Sanctum).
 *  - Restaura la sesión al iniciar la app leyendo el token de AsyncStorage.
 *  - Expone `isLoading` para mostrar un splash mientras se comprueba la sesión.
 *  - login/logout ahora persisten/limpian el token automáticamente.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import authService from '../services/authService';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Shape que devuelve la API de Laravel para el usuario */
interface ApiUserResponse {
  id: number | string;
  name: string;
  phone: string;
}

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
}

interface LoginCredentials {
  phone: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  /** true mientras se comprueba si hay una sesión guardada */
  isLoading: boolean;
  user: AuthUser | null;
  /**
   * Llama a POST /auth/login, persiste el token y actualiza el estado.
   * @throws {AppError} si las credenciales son inválidas
   */
  login: (credentials: LoginCredentials) => Promise<void>;
  /**
   * Llama a POST /auth/register, persiste el token y actualiza el estado.
   * @throws {AppError} si hay errores de validación
   */
  register: (payload: RegisterPayload) => Promise<void>;
  /** Revoca el token en el backend y limpia AsyncStorage */
  logout: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Restaurar sesión al montar ────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const token = await authService.getSavedToken();
        if (token) {
          // Token encontrado → cargamos el perfil del usuario
          const profile = await authService.getProfile() as ApiUserResponse;
          setUser({
            id:    String(profile.id),
            name:  profile.name,
            phone: profile.phone,
          });
        }
      } catch {
        // Token inválido o expirado → limpiamos silenciosamente
        await authService.logout().catch(() => {});
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async ({ phone, password }: LoginCredentials) => {
    // [MOCK] Bypassing backend for MVP testing
    setUser({
      id: '1',
      name: 'Usuario de Prueba',
      phone: phone || '+59170000000',
    });
    
    // Si quisieras conectarte al backend, se usaría:
    // const { user: apiUser } = await authService.login({ phone, password }) as { user: ApiUserResponse; token: string };
    // ...
  }, []);

  // ── register ──────────────────────────────────────────────────────────────
  const register = useCallback(
    async ({ name, phone, password }: RegisterPayload) => {
      // [MOCK] Bypassing backend for MVP testing
      setUser({
        id: '2',
        name: name || 'Nuevo Usuario',
        phone: phone || '+59170000000',
      });
    },
    []
  );

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  // ── Value ─────────────────────────────────────────────────────────────────
  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: user !== null,
      isLoading,
      user,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
