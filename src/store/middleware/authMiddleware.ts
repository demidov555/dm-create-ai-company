import { Middleware } from "@reduxjs/toolkit";

const AUTH_STORAGE_KEY = "auth_state";

export const authMiddleware: Middleware = (storeAPI) => (next) => (action: any) => {
  const result = next(action);

  if (action.type?.startsWith("auth/")) {
    const state = storeAPI.getState() as any;
    const authState = {
      isAuthenticated: state.auth?.isAuthenticated,
      phoneNumber: state.auth?.phoneNumber,
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    } catch (error) {
      console.error("Failed to save auth state:", error);
    }
  }

  return result;
};

export const loadAuthState = () => {
  try {
    const serializedState = localStorage.getItem(AUTH_STORAGE_KEY);
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Failed to load auth state:", error);
    return undefined;
  }
};
