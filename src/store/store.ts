import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./slices/projectsSlice";
import uiReducer from "./slices/uiSlice";
import agentsReducer from "./slices/agentsSlice";
import projectDetailsSlice from "./slices/projectDetailsSlice";
import chatReducer from "./slices/chatSlice";
import authReducer from "./slices/authSlice";
import { authMiddleware } from "./middleware/authMiddleware";

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    projectDetails: projectDetailsSlice,
    ui: uiReducer,
    agents: agentsReducer,
    chat: chatReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(authMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
