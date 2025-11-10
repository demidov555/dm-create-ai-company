import { VITE_API_URL } from "../../configs/env";
import { TokenResponse } from "../store/slices/authSlice";
import { localStorageService } from "./localStorageService";

class AuthService {
  private readonly API_URL = VITE_API_URL
  private readonly TOKEN_KEY = "access_token";
  private readonly PHONE_KEY = "phone";
  private readonly UID_KEY = "uid";
  private readonly AUTH_STATE_KEY = "auth_state";

  async loginWithFirebase(idToken: string): Promise<TokenResponse> {
    const response = await fetch(`${this.API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Ошибка авторизации");
    }

    const data: TokenResponse = await response.json();
    this.setToken(data.access_token);
    if (data.phone) this.setPhone(data.phone);
    return data;
  }

  logout(): void {
    localStorageService.removeItem(this.TOKEN_KEY);
    localStorageService.removeItem(this.PHONE_KEY);
    localStorageService.removeItem(this.UID_KEY);
    localStorageService.removeItem(this.AUTH_STATE_KEY);
  }

  getToken(): string | null {
    return localStorageService.getItem(this.TOKEN_KEY);
  }

  getPhone(): string | null {
    return localStorageService.getItem(this.PHONE_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorageService.setItem(this.TOKEN_KEY, token);
  }

  private setPhone(phone: string): void {
    localStorageService.setItem(this.PHONE_KEY, phone);
  }
}

export const authService = new AuthService();