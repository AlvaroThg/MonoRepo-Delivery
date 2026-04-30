import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('Completa todos los campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
    } catch (err: any) {
      setError(err?.message ?? 'Error al crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>Sat</Text>
        <Text style={styles.brand}>Crear Cuenta</Text>
        <Text style={styles.tagline}>Unete a la red de entregas.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Juan Perez"
            placeholderTextColor="#555B6E"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Correo electronico</Text>
          <TextInput
            style={styles.input}
            placeholder="tu-correo@ejemplo.com"
            placeholderTextColor="#555B6E"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Telefono</Text>
          <TextInput
            style={styles.input}
            placeholder="73333333"
            placeholderTextColor="#555B6E"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contrasena</Text>
          <TextInput
            style={styles.input}
            placeholder="Minimo 8 caracteres"
            placeholderTextColor="#555B6E"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.btnText}>Crear Cuenta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta?{' '}
              <Text style={styles.linkBold}>Iniciar Sesion</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F1117',
  },
  inner: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  logo: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 8,
    color: '#93C5FD',
    fontWeight: '900',
  },
  brand: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 36,
    marginTop: 6,
  },
  form: {
    backgroundColor: '#1C2030',
    borderRadius: 20,
    padding: 24,
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
