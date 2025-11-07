import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithPhoneNumber } from "firebase/auth";
import { authService } from "../../services/authService";
import { auth, createRecaptchaVerifier } from "../../firebase/firebaseConfig";

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

export const logout = createAsyncThunk("auth/logout", async () => {
  authService.logout();
  return {};
});

const clearIndexedDB = () => {
  const request = indexedDB.deleteDatabase("firebaseLocalStorageDb");
  request.onsuccess = () => console.log("IndexedDB очищен");
  request.onerror = () => console.error("Ошибка очистки IndexedDB");
  request.onblocked = () => console.warn("IndexedDB заблокирован");
};