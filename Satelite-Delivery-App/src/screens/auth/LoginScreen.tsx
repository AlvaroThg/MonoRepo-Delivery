import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Ingresa tu correo y contrasena.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login({ email: email.trim(), password });
    } catch (err: any) {
      setError(err?.message ?? 'Error al iniciar sesion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>Sat</Text>
        <Text style={styles.brand}>Satelite Delivery</Text>
        <Text style={styles.tagline}>Tu pedido, con precision orbital.</Text>
        <Text style={styles.demoHint}>
          Demo: cliente@satelite.com / password123
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Correo electronico</Text>
          <TextInput
            style={styles.input}
            placeholder="cliente@satelite.com"
            placeholderTextColor="#555B6E"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Contrasena</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#555B6E"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.btnText}>Iniciar Sesion</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>
              ¿No tienes cuenta?{' '}
              <Text style={styles.linkBold}>Registrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F1117',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logo: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 8,
    color: '#93C5FD',
    fontWeight: '900',
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 6,
  },
  demoHint: {
    color: '#93C5FD',
    textAlign: 'center',
    marginBottom: 28,
    fontSize: 13,
    fontWeight: '600',
  },
  form: {
    backgroundColor: '#1C2030',
    borderRadius: 20,
    padding: 24,
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 6,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: '#262C3E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2E3550',
  },
  error: {
    color: '#F87171',
    fontSize: 13,
    marginTop: 10,
    fontWeight: '500',
  },
  btn: {
    backgroundColor: '#3B82F6',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  btnDisabled: {
    opacity: 0.65,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  link: {
    alignItems: 'center',
    marginTop: 18,
  },
  linkText: {
    color: '#6B7280',
    fontSize: 14,
  },
  linkBold: {
    color: '#3B82F6',
    fontWeight: '700',
  },
});
