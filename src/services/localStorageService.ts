export class LocalStorageService {
  getItem(key: string): string {
    if (typeof window === "undefined") return;

    try {
      const item = localStorage.getItem(key);
      return item
    } catch (e) {
      console.warn("localStorage get error:", e);
    }
  };

  setItem(key: string, value: any): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("localStorage set error:", e);
    }
  };

  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  };
};

export const localStorageService = new LocalStorageService();