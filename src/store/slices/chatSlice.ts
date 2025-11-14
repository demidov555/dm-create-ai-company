import { VITE_API_URL } from "@configs/env";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@services/api";
import { debouncedSendMessage } from "@store/utils/debouncedSender";

export interface Message {
  messageId?: string;
  projectId: string;
  userId: number;
  role: "user" | "agent" | "system";
  message: string;
  timestamp?: string;
}

type ChatState = {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean
  messageIndexMap: Record<string, number>;
  currentStreamId: string;
};

const initialState: ChatState = {
  messages: [],
  isLoading: false,
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
    addMessages(state, action: PayloadAction<Message[]>) {
      state.messages.push(...action.payload);
    },
    startStream(state, action: PayloadAction<Message>) {
      const msg = action.payload;
      state.isTyping = true;
      state.isLoading = false;
      const indexMessage = state.messages.length
      state.messages.push(msg);
      state.currentStreamId = msg.messageId;
      state.messageIndexMap[msg.messageId] = indexMessage;
    },
    appendToCurrentStream(state, action: PayloadAction<{ chunk: string; messageId: string }>) {
      const chunk = action.payload.chunk;
      const messageIndex = state.messageIndexMap[action.payload.messageId];

      if (messageIndex === undefined) return;

      state.messages[messageIndex].message += chunk;
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
        state.isLoading = true;
      })
      .addCase(sendSSEMessage.rejected, (state) => {
        state.isLoading = false;
      })


      .addCase(cancelAiTyping.fulfilled, (state) => {
        state.isTyping = false;
      })
      .addCase(cancelAiTyping.rejected, (state) => {
        state.isTyping = false;
      })

      .addCase(fetchHistoryMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHistoryMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.isLoading = false;
        state.currentStreamId = null;
        state.messages.push(...action.payload);
        state.messageIndexMap = {};
        state.messages.forEach((m, index) => {
          if (m.messageId) {
            state.messageIndexMap[m.messageId] = index;
          }
        });
      })
      .addCase(fetchHistoryMessages.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

/** === Async actions === */
export const sendUserMessage = (message: Message) => async (dispatch) => {
  dispatch(addMessage(message));
  debouncedSendMessage(message);
};

export const sendSSEMessage = createAsyncThunk<void, Message, { rejectValue: string }>(
  "chat/sendMessage",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(`${VITE_API_URL}/chat_message`, {
        project_id: Number(payload.projectId),
        user_id: payload.userId,
        role: payload.role,
        message: payload.message,
      });

      if (!response.data) {
        return rejectWithValue(`Ошибка ответа сервера: ${response.status}`);
      }
    } catch (err) {
      console.error("[SSE] Ошибка при отправке сообщения:", err);
      return rejectWithValue("Ошибка при отправке сообщения");
    }
  }
);

export const cancelAiTyping = createAsyncThunk<void, string, { rejectValue: string }>(
  "chat/cancelStream",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.post(`${VITE_API_URL}/chat_cancel/${projectId}`);

      if (!response.data) {
        return rejectWithValue(`Ошибка ответа сервера: ${response.status}`);
      }
    } catch (err) {
      console.error("[SSE] Ошибка при отмене SSE:", err);
      return rejectWithValue("Ошибка при отмене SSE");
    }
  }
);

export const fetchHistoryMessages = createAsyncThunk<Message[], string, { rejectValue: string }>(
  "chat/fetchHistoryMessages",
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
      console.error("[SSE] Ошибка при получении истории сообщений:", err);
      return rejectWithValue("Ошибка при получении истории сообщений");
    }
  }
);

/** Экшены */
export const {
  addMessage,
  addMessages,
  startStream,
  appendToCurrentStream,
  endStream,
} = chatSlice.actions;

export default chatSlice.reducer;

