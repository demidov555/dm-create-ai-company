import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./slices/projectsSlice";
import uiReducer from "./slices/uiSlice";
import agentsReducer from "./slices/agentsSlice";

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    ui: uiReducer,
    agents: agentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
