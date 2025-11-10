import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Theme, themeService } from "@services/themeService";

interface UIState {
  dialogs: Record<string, boolean>;
  sidebarCollapsed: boolean;
  theme: Theme;
  notifications: {
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }[]
}

const initialState: UIState = {
  dialogs: {},
  sidebarCollapsed: false,
  theme: themeService.get(),
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // === ДИАЛОГИ ===
    openDialog: (state, action: PayloadAction<string>) => {
      state.dialogs[action.payload] = true;
    },
    closeDialog: (state, action: PayloadAction<string>) => {
      state.dialogs[action.payload] = false;
    },
    toggleDialog: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.dialogs[id] = !state.dialogs[id];
    },

    // === САЙДБАР ===
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    // === ТЕМА ===
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      themeService.set(action.payload)
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";

      state.theme = newTheme;
      themeService.set(newTheme);
    },

    // === УВЕДОМЛЕНИЯ ===
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id">>
    ) => {
      const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
      state.notifications.push({ id, ...action.payload });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

type Notification = {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
};

export const {
  openDialog,
  closeDialog,
  toggleDialog,
  toggleSidebar,

  setTheme,
  toggleTheme,

  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;


export const selectDialogOpen = (dialogId: string) =>
  createSelector(
    (state: RootState) => state.ui.dialogs,
    (dialogs) => dialogs[dialogId] ?? false
  );

export const selectSidebarCollapsed = (state: RootState) => state.ui.sidebarCollapsed;
export const selectTheme = (state: RootState): Theme => state.ui.theme;
export const selectNotifications = (state: RootState) => state.ui.notifications;

export default uiSlice.reducer;