import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadAuthState } from "../middleware/authMiddleware";
import { localStorageService } from "@services/localStorageService";
import { auth, createRecaptchaVerifier } from "../../firebase/firebaseConfig";
import { signInWithPhoneNumber } from "firebase/auth";
import { authService } from "@services/authService";

export type VerificationStep = "phone" | "otp" | "authenticated";

export interface User {
  id: string;
  phone: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  verificationStep: VerificationStep;
  isLoading: boolean;
  error: string | null;
  uid: null | string
  user: User;
}

export interface FirebaseToken {
  id_token: string;
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
  user: {
    id: null,
    phone: null,
  }
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
      authService.logout();
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
  extraReducers: (builder) => {
    builder
      .addCase(sendCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.phoneNumber = action.payload;
        state.verificationStep = "otp";
      })
      .addCase(sendCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(verifyPhoneCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPhoneCode.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.phoneNumber = action.payload.phone;
        state.uid = action.payload.uid.toString();
        state.verificationStep = "authenticated";
        state.user = {
          id: '101',
          phone: action.payload.phone,
        };

        localStorageService.setItem("access_token", action.payload.access_token);
        localStorageService.setItem("phone", action.payload.phone || "");
        localStorageService.setItem("uid", action.payload.uid);
      })
      .addCase(verifyPhoneCode.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

let confirmationResult: any = null;

export const sendCode = createAsyncThunk(
  "auth/sendCode",
  async (phone: string, { rejectWithValue }) => {
    try {
      const appVerifier = createRecaptchaVerifier();
      confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);

      return phone;
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка отправки кода");
    }
  }
);

export const verifyPhoneCode = createAsyncThunk(
  "auth/verifyPhoneCode",
  async (code: string, { rejectWithValue }) => {
    try {
      if (!confirmationResult) {
        return rejectWithValue("Код не был отправлен");
      }

      const result = await confirmationResult.confirm(code);
      const idToken = await result.user.getIdToken();
      const data = await authService.loginWithFirebase(idToken);

      await auth.signOut();
      clearIndexedDB();

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Неверный код");
    }
  }
);

const clearIndexedDB = () => {
  const request = indexedDB.deleteDatabase("firebaseLocalStorageDb");
  request.onsuccess = () => console.log("IndexedDB очищен");
  request.onerror = () => console.error("Ошибка очистки IndexedDB");
  request.onblocked = () => console.warn("IndexedDB заблокирован");
};

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