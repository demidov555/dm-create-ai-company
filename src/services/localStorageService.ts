export class LocalStorageService {
  getItem<T>(key: string): T {
    if (typeof window === "undefined") return;

    try {
      const item = localStorage.getItem(key);
      return item && JSON.parse(item)
    } catch (e) {
      console.warn("localStorage get error:", e);
    }
  };

  setItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
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