import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface UIState {
  dialogs: Record<string, boolean>;
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
  notifications: {
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }[]
}

const initialState: UIState = {
  dialogs: {
    // Пример: можно инициализировать нужные
    // createProject: false,
    // editTask: false,
    // settings: false,
  },
  sidebarCollapsed: false,
  theme: "light",
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
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
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
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

// === СЕЛЕКТОРЫ ===
export const selectDialogOpen = (dialogId: string) =>
  createSelector(
    (state: RootState) => state.ui.dialogs,
    (dialogs) => dialogs[dialogId] ?? false
  );

export const selectSidebarCollapsed = (state: RootState) => state.ui.sidebarCollapsed;
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectNotifications = (state: RootState) => state.ui.notifications;

export default uiSlice.reducer;