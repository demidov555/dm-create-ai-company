import { RootState } from "../store";
import { createSelector } from "reselect";

export const selectChatState = (s: RootState) => s.chat;
export const selectMessages = createSelector(selectChatState, (chat) => chat.messages);
export const selectLastMessage = createSelector(selectMessages, (messages) => messages[messages.length - 1] ?? null);
export const selectIsConnected = createSelector(selectChatState, (chat) => chat.connected);
export const selectIsLoading = createSelector(selectChatState, (chat) => chat.isLoading);