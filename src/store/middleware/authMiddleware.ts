import { Middleware } from "@reduxjs/toolkit";
import { localStorageService } from "@services/localStorageService";

const AUTH_STORAGE_KEY = "auth_state";

export const authMiddleware: Middleware = (storeAPI) => (next) => (action: any) => {
  const result = next(action);

  if (action.type?.startsWith("auth/")) {
    const state = storeAPI.getState();
    const authState = {
      isAuthenticated: state.auth?.isAuthenticated,
      phoneNumber: state.auth?.phoneNumber,
    };

    try {
      localStorageService.setItem(AUTH_STORAGE_KEY, authState);
    } catch (error) {
      console.error("Failed to save auth state:", error);
    }
  }

  return result;
};

export const loadAuthState = () => {
  try {
    const serializedState = localStorageService.getItem(AUTH_STORAGE_KEY);
    if (serializedState === null) return undefined;

    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Failed to load auth state:", error);
    return undefined;
  }
};
