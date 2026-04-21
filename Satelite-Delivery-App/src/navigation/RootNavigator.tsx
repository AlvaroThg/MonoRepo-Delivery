/**
 * @file RootNavigator.tsx
 * Root switcher: renders AuthStack or AppStack based on isAuthenticated.
 * No transition animation between stacks to avoid flicker on auth change.
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();

  // React Navigation handles unmount/mount automatically.
  // Both stacks are kept in separate navigator trees to avoid key conflicts.
  return isAuthenticated ? <AppStack /> : <AuthStack />;
}
