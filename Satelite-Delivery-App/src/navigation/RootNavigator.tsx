/**
 * @file RootNavigator.tsx
 * Root switcher: renders AuthStack or AppStack based on isAuthenticated.
 * No transition animation between stacks to avoid flicker on auth change.
 */

import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0F1117',
          gap: 16,
        }}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
          Reconectando tu sesion...
        </Text>
      </View>
    );
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
}
