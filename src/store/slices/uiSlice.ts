import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  createProjectDialogOpen: boolean;
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
  notifications: Array<{
    id: string;
    type: "success" | "error" | "info";
    message: string;
  }>;
}

const initialState: UIState = {
  createProjectDialogOpen: false,
  sidebarCollapsed: false,
  theme: "light",
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCreateProjectDialog: (state) => {
      state.createProjectDialogOpen = true;
    },
    closeCreateProjectDialog: (state) => {
      state.createProjectDialogOpen = false;
    },
    toggleCreateProjectDialog: (state) => {
      state.createProjectDialogOpen = !state.createProjectDialogOpen;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<{
        type: "success" | "error" | "info";
        message: string;
      }>
    ) => {
      state.notifications.push({
        id: String(Date.now()),
        ...action.payload,
      });
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

export const {
  openCreateProjectDialog,
  closeCreateProjectDialog,
  toggleCreateProjectDialog,
  toggleSidebar,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
