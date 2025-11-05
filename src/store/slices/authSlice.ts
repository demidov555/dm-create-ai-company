import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadAuthState } from "../middleware/authMiddleware";

export type VerificationStep = "phone" | "otp" | "authenticated";

export interface AuthState {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  verificationStep: VerificationStep;
  isLoading: boolean;
  error: string | null;
}

const persistedAuth = loadAuthState();

const initialState: AuthState = {
  isAuthenticated: persistedAuth?.isAuthenticated || false,
  phoneNumber: persistedAuth?.phoneNumber || null,
  verificationStep: persistedAuth?.isAuthenticated ? "authenticated" : "phone",
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sendVerificationCode: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.phoneNumber = action.payload;
    },
    sendVerificationCodeSuccess: (state) => {
      state.isLoading = false;
      state.verificationStep = "otp";
    },
    sendVerificationCodeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    verifyCode: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    verifyCodeSuccess: (state) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.verificationStep = "authenticated";
      state.error = null;
    },
    verifyCodeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.phoneNumber = null;
      state.verificationStep = "phone";
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetVerification: (state) => {
      state.verificationStep = "phone";
      state.phoneNumber = null;
      state.error = null;
    },
  },
});

export const {
  sendVerificationCode,
  sendVerificationCodeSuccess,
  sendVerificationCodeFailure,
  verifyCode,
  verifyCodeSuccess,
  verifyCodeFailure,
  logout,
  clearError,
  resetVerification,
} = authSlice.actions;

export default authSlice.reducer;
