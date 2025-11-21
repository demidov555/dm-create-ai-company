import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@services/api";
import { notificationService } from "@services/notification";
import { debouncedSendMessage } from "@store/utils/debouncedSender";

export interface Message {
  projectId: string;
  role: "user" | "agent" | "system";
  message: string;
  messageId?: string;
  timestamp?: string;
}

type ChatState = {
  messages: Message[];
  isTyping: boolean;
  isLoadingMessage: boolean;
  isLoadingMessages: boolean;
  messageIndexMap: Record<string, number>;
  currentStreamId: string;
};

const initialState: ChatState = {
  messages: [],
  isLoadingMessage: false,
  isLoadingMessages: false,
  isTyping: false,
  messageIndexMap: {},
  currentStreamId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    startStream(state, action: PayloadAction<Message>) {
      const { messageId, projectId, role, message } = action.payload;
      const indexMessage = state.messages.length;
      const msg: Message = {
        messageId,
        projectId,
        role,
        message,
      };

      state.isTyping = true;
      state.isLoadingMessage = false;
      state.messages.push(msg);
      state.currentStreamId = messageId;
      state.messageIndexMap[messageId] = indexMessage;
    },
    appendToCurrentStream(state, action: PayloadAction<{ chunk: string; messageId: string; }>) {
      const chunk = action.payload.chunk;
      const messageIndex = state.messageIndexMap[action.payload.messageId];

      if (messageIndex === undefined) return;

      const message = state.messages[messageIndex];

      message.message += chunk;
    },
    endStream(state) {
      state.isTyping = false;
      state.isTyping = false;

      const currentStreamId = state.currentStreamId;
      const index = state.messageIndexMap[currentStreamId];

      if (index === undefined) {
        state.messageIndexMap = {};
        state.currentStreamId = null;
        return;
      }

      // Держим только текущий стрим чтобы не перегружать мапу
      state.messageIndexMap = { [state.currentStreamId]: index };
      state.currentStreamId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendSSEMessage.pending, (state) => {
        state.isLoadingMessage = true;
      })
      .addCase(sendSSEMessage.rejected, (state) => {
        state.isLoadingMessage = false;
        notificationService.error('Ошибка соединения с чатом');
      })

      .addCase(cancelAiTyping.fulfilled, (state) => {
        state.isTyping = false;
      })
      .addCase(cancelAiTyping.rejected, (state) => {
        state.isTyping = false;
      })

      .addCase(getHistoryMessages.pending, (state) => {
        state.isLoadingMessages = true;
      })
      .addCase(getHistoryMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.messages = [];
        state.isLoadingMessages = false;
        state.currentStreamId = null;
        state.messages.push(...action.payload);
        state.messageIndexMap = {};
        state.messages.forEach((m, index) => {
          if (m.messageId) {
            state.messageIndexMap[m.messageId] = index;
          }
        });
      }
      )
      .addCase(getHistoryMessages.rejected, (state) => {
        state.isLoadingMessages = false;
        notificationService.error('Ошибка при получении истории сообщений');
      });
  },
});

/** === Async actions === */
export const sendUserMessage = (message: Message) => async (dispatch) => {
  dispatch(addMessage(message));
  debouncedSendMessage(message);
};

export const sendSSEMessage = createAsyncThunk<void, Message, { rejectValue: string }>(
  "chat/sendSSEMessage",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/chat_message', {
        project_id: payload.projectId,
        role: payload.role,
        message: payload.message,
      });

      if (!response.data) {
        return rejectWithValue(`[SSE] Ошибка ответа сервера: ${response.status}`);
      }
    } catch (err) {
      return rejectWithValue("[SSE] Ошибка при отправке сообщения");
    }
  }
);

export const cancelAiTyping = createAsyncThunk<void, string, { rejectValue: string }>(
  "chat/cancelAiTyping",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/chat_cancel/${projectId}`);

      if (!response.data) {
        return rejectWithValue(`[SSE ]Ошибка ответа сервера: ${response.status}`);
      }
    } catch (err) {
      return rejectWithValue("[SSE] Ошибка при отмене SSE");
    }
  }
);

export const getHistoryMessages = createAsyncThunk<Message[], string, { rejectValue: string }>(
  "chat/getHistoryMessages",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/history_messages/${projectId}`);
      const data = res.data;

      if (Array.isArray(data)) {
        return data as Message[];
      } else if (data && Array.isArray(data.messages)) {
        return data.messages as Message[];
      } else {
        return [];
      }
    } catch (err) {
      return rejectWithValue("Ошибка при получении истории сообщений");
    }
  }
);

/** Экшены */
export const {
  addMessage,
  startStream,
  appendToCurrentStream,
  endStream,
} = chatSlice.actions;

export default chatSlice.reducer;

