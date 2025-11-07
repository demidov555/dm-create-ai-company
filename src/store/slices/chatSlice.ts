import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { api } from "../../../src/services/api";
import { CHAT_SSE_URL } from "../../../configs/env";

const msgs = [
  {
    "projectId": '1',
    "message": "Привет, агент!",
    "role": "user",
    "userId": 101
  },
  {
    "projectId": '1',
    "message": "Привет! Какое приложение я могу собрать для тебя?",
    "role": "agent",
    "userId": 101
  },
  {
    "projectId": '1',
    "message": "Я хочу веб-приложение для продвижения товаров и услуг",
    "role": "user",
    "userId": 101
  },
  {
    "projectId": '1',
    "message": "Отлично! Могу я уточнить ТЗ?",
    "role": "agent",
    "userId": 101
  },
  {
    "projectId": '1',
    "message": "Приложение должно быть на Angular и Node.js. Сделай минимальный MVP.",
    "role": "user",
    "userId": 101
  }
] as Message[]

export interface Message {
  projectId: string | number;
  userId: number;
  role: "user" | "agent";
  message: string;
  isLoading: boolean;
}

type ChatState = {
  connected: boolean;
  messages: Message[];
  isLoading: boolean;
};

const initialState: ChatState = {
  connected: false,
  messages: [],
  isLoading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    addMessages(state, action: PayloadAction<Message[]>) {
      state.messages.push(...action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setConnected, addMessage, addMessages, clearMessages, setLoading } = chatSlice.actions;
export default chatSlice.reducer;

export const sendMessage = (payload: Message) => async (dispatch: AppDispatch) => {
  dispatch(addMessage(payload));
  dispatch(setLoading(true));

  try {
    const response = await api.post(CHAT_SSE_URL, {
      project_id: Number(payload.projectId),
      user_id: payload.userId,
      role: payload.role,
      message: payload.message,
    });

    if (!response.data) {
      throw new Error(`Ошибка ответа сервера: ${response.status}`);
    }

    console.log(response.data);
    dispatch(addMessage(response.data));
    dispatch(setLoading(false));
  } catch (error) {
    console.error("[SSE] Ошибка при отправке сообщения:", error);
    dispatch(setLoading(false));
  }
};

export const fetchHistoryMessages = (projectId: string) => async (dispatch: AppDispatch) => {
  try {
    const res = await api.get(`/history_messages/${projectId}`);
    const data = res.data;
    if (Array.isArray(data)) {
      dispatch(addMessages(data));
    } else if (data && Array.isArray(data.messages)) {
      dispatch(addMessages(data.messages));
    }
  } catch (err) {
    // dispatch(addMessages(msgs));
    return err;
  }
};