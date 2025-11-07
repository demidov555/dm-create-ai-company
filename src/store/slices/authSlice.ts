// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadAuthState } from "../middleware/authMiddleware";
import { sendCode, verifyPhoneCode, logout } from "./authThunks";

export type VerificationStep = "phone" | "otp" | "authenticated";

export interface AuthState {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  verificationStep: VerificationStep;
  isLoading: boolean;
  error: string | null;
  uid: null | string
}

export interface FirebaseToken {
  id_token: string;  // ← точно как в Pydantic
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  uid: string;
  phone: string | null;
}

const persistedAuth = loadAuthState();

const initialState: AuthState = {
  isAuthenticated: persistedAuth?.isAuthenticated ?? false,
  phoneNumber: persistedAuth?.phoneNumber ?? null,
  verificationStep: persistedAuth?.verificationStep ?? "phone",
  isLoading: false,
  error: null,
  uid: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Оставь, если используешь где-то напрямую
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
    verifyCode: (state) => {
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
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.phoneNumber = null;
      state.verificationStep = "phone";
      state.error = null;
      state.isLoading = false;
      logout()
    },
    clearError: (state) => {
      state.error = null;
    },
    resetVerification: (state) => {
      state.verificationStep = "phone";
      state.phoneNumber = null;
      state.error = null;
      state.isLoading = false;
    },
  },

  // extraReducers — используем thunks напрямую!
  extraReducers: (builder) => {
    builder
      // sendCode
      .addCase(sendCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.phoneNumber = action.payload; // ← payload есть!
        state.verificationStep = "otp";
      })
      .addCase(sendCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string; // ← payload есть!
      })

      // verifyCode
      .addCase(verifyPhoneCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPhoneCode.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.phoneNumber = action.payload.phone;
        state.uid = action.payload.uid.toString();
        state.verificationStep = "authenticated";

        // Сохраняем в localStorage
        localStorage.setItem("access_token", action.payload.access_token);
        localStorage.setItem("phone", action.payload.phone || "");
        localStorage.setItem("uid", action.payload.uid);
      })
      .addCase(verifyPhoneCode.rejected, (state, action) => {
        state.isLoading = false;
        // state.error = action.payload || "Ошибка проверки кода";  // ← типизировано!
      });
},
});

export const {
  sendVerificationCode,
  sendVerificationCodeSuccess,
  sendVerificationCodeFailure,
  verifyCode,
  verifyCodeSuccess,
  verifyCodeFailure,
  logoutUser,
  clearError,
  resetVerification,
} = authSlice.actions;

export default authSlice.reducer;