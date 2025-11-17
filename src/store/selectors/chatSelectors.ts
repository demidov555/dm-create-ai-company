import { RootState } from "../store";
import { createSelector } from "reselect";

export const selectChatState = (s: RootState) => s.chat;
export const selectMessages = createSelector(selectChatState, (chat) => chat.messages);
export const selectIsLoadingMessages = createSelector(selectChatState, (chat) => chat.isLoadingMessages);
export const selectIsLoadingMessage = createSelector(selectChatState, (chat) => chat.isLoadingMessage);
export const selectIsTyping = createSelector(selectChatState, (chat) => chat.isTyping);