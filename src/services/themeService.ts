import { localStorageService } from "./localStorageService";

const THEME_KEY = "app-theme";

export type Theme = "light" | "dark";

export class ThemeService {
  private static instance: ThemeService;

  public static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  public get(): Theme {
    return localStorageService.getItem(THEME_KEY) as Theme;
  }

  public set(theme: Theme): void {
    localStorageService.setItem(THEME_KEY, theme);
    this.applyToDocument(theme);
  }

  public toggle(): Theme {
    const newTheme = this.get() === "light" ? "dark" : "light";
    this.set(newTheme);
    return newTheme;
  }


  public init(): Theme {
    const theme = this.get();
    this.applyToDocument(theme);
    return theme;
  }

  private applyToDocument(theme: Theme): void {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }
}

export const themeService = ThemeService.getInstance();