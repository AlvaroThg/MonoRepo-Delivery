/**
 * @file types.ts
 * Centralized TypeScript types for all navigation stacks.
 * Import these in screens to get typed navigation props.
 */

// ─── Auth Stack ──────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// ─── App Stack ───────────────────────────────────────────────────────────────

export type AppStackParamList = {
  Home: undefined;
  StoreDetail: { storeId: string; storeName?: string };
  Cart: undefined;
  OrderTracking: { orderId: string };
  Checkout: undefined;
};

// ─── Root Navigator ──────────────────────────────────────────────────────────

export type RootParamList = {
  Auth: AuthStackParamList;
  App: AppStackParamList;
};
