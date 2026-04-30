import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import authService from '../services/authService';
import { useCart } from './CartContext';
import type { AuthUser } from '../types/models';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { clearCart } = useCart();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await authService.getSavedToken();

        if (token) {
          setUser(await authService.getProfile());
        }
      } catch {
        await authService.logout().catch(() => {});
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async ({ email, password }: LoginCredentials) => {
    const { user: authenticatedUser } = await authService.login({ email, password });
    setUser(authenticatedUser);
  }, []);

  const register = useCallback(
    async ({ name, email, phone, password }: RegisterPayload) => {
      const { user: authenticatedUser } = await authService.register({
        name,
        email,
        phone,
        password,
      });
      setUser(authenticatedUser);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearCart();
      setUser(null);
    }
  }, [clearCart]);

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

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }

  return context;
}
