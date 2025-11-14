import { RootState } from "../store";
import { createSelector } from "reselect";

export const selectChatState = (s: RootState) => s.chat;
export const selectMessages = createSelector(selectChatState, (chat) => chat.messages);
export const selectIsLoading = createSelector(selectChatState, (chat) => chat.isLoading);
export const selectIsTyping = createSelector(selectChatState, (chat) => chat.isTyping);