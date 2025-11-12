/** Тестовые константы */
// export const msgs = [
//   {
//     projectId: '1',
//     message: "Привет, агент!",
//     role: "user",
//     userId: 101,
//     isLoading: false,
//   },
//   {
//     projectId: '1',
//     message: "Привет! Какое приложение я могу собрать для тебя?",
//     role: "agent",
//     userId: 101,
//     isLoading: false,
//   },
//   {
//     projectId: '1',
//     message: "Я хочу веб-приложение для продвижения товаров и услуг",
//     role: "user",
//     userId: 101,
//     isLoading: false,
//   },
//   {
//     projectId: '1',
//     message: "Отлично! Могу я уточнить ТЗ?",
//     role: "agent",
//     userId: 101,
//     isLoading: false,
//   },
//   {
//     projectId: '1',
//     message: "Приложение должно быть на Angular и Node.js. Сделай минимальный MVP.",
//     role: "user",
//     userId: 101,
//     isLoading: false,
//   }
// ] as Message[];

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@services/api";
import { CHAT_SSE_URL } from "@configs/env";

/** Тип сообщения */
export interface Message {
  messageId?: string; // идентификатор потока (message_id)
  projectId: string;
  userId: number;
  role: "user" | "agent" | "system";
  message: string;
  timestamp?: string;
}

/** Состояние */
type ChatState = {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean
  currentStreamId?: string | null;
};

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  isTyping: false,
  currentStreamId: null
};

/** Slice */
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    /** Добавляем сообщение в историю (user/system/финальное agent) */
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },

    /** Массовое добавление (например, при загрузке истории) */
    addMessages(state, action: PayloadAction<Message[]>) {
      state.messages.push(...action.payload);
    },

    /** Начало нового стрима */
    startStream(state, action: PayloadAction<Message>) {
      const msg = action.payload;
      state.isTyping = true;
      state.isLoading = false;
      state.messages.push(msg);
      state.currentStreamId = msg.messageId || null;
    },

    /** Обновляем последний активный стрим без поиска */
    appendToCurrentStream(state, action: PayloadAction<string>) {
      const chunk = action.payload;
      const last = state.messages[state.messages.length - 1];
      if (!last) return;

      // Просто добавляем чанк как есть
      last.message += chunk;
    },

    /** Завершение стрима */
    endStream(state) {
      state.isTyping = false;
      state.currentStreamId = null;
    },
  },

  /** Внешние асинхронные экшены */
  extraReducers: (builder) => {
    builder
      // === Отправка сообщения ===
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        // state.isLoading = false;
      })
      .addCase(sendMessage.rejected, (state) => {
        state.isLoading = false;
      })

      // === Загрузка истории ===
      .addCase(fetchHistoryMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHistoryMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchHistoryMessages.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

/** === Async actions === */

/** Отправка сообщения (user → backend) */
export const sendMessage = createAsyncThunk<void, Message, { rejectValue: string }>(
  "chat/sendMessage",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(CHAT_SSE_URL, {
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

/** Получение истории сообщений */
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

