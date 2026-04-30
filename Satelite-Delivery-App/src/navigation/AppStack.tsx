/**
 * @file AppStack.tsx
 * Stack navigator for authenticated users.
 * Screens: Home → StoreDetail → Cart → OrderTracking (+Checkout)
 */

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from './types';

import HomeScreen from '../screens/app/HomeScreen';
import StoreDetailScreen from '../screens/app/StoreDetailScreen';
import CartScreen from '../screens/app/CartScreen';
import OrderTrackingScreen from '../screens/app/OrderTrackingScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator<AppStackParamList>();

// ─── Shared header options ────────────────────────────────────────────────────

const screenOptions = {
  headerStyle: { backgroundColor: '#0F1117' },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: '700' as const, fontSize: 18 },
  contentStyle: { backgroundColor: '#F8F9FB' },
  animation: 'slide_from_right' as const,
};

// ─── Logout button ────────────────────────────────────────────────────────────

function LogoutButton() {
  const { logout } = useAuth();
  return (
    <TouchableOpacity onPress={logout} style={{ marginRight: 4, padding: 6 }}>
      <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Salir</Text>
    </TouchableOpacity>
  );
}

// ─── Navigator ───────────────────────────────────────────────────────────────

export default function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '🛰 Satélite Delivery',
          headerRight: () => <LogoutButton />,
        }}
      />
      <Stack.Screen
        name="StoreDetail"
        component={StoreDetailScreen}
        options={({ route }) => ({
          title: route.params?.storeName ?? 'Tienda',
          headerShown: true,
        })}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Mi Carrito' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout', headerShown: false }}
      />
      <Stack.Screen
        name="OrderTracking"
        component={OrderTrackingScreen}
        options={{ title: 'Seguimiento del Pedido' }}
      />
    </Stack.Navigator>
  );
}
