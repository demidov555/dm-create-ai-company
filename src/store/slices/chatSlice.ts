import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { socketService } from "../../services/socket";
import { api } from "../../../src/services/api";

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
  projectId: string;
  userId: number;
  role: "user" | "agent";
  message: string;
}


type ChatState = {
  connected: boolean;
  messages: Message[];
};


const initialState: ChatState = {
  connected: false,
  messages: [],
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
  },
});

export const { setConnected, addMessage, addMessages, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;

export const sendMessage = (payload: Message) => (dispatch: AppDispatch) => {
  socketService.emit("chat:message", payload);
  dispatch(addMessage(payload));
};

export const fetchHistoryMessages = (projectId: string) => async (dispatch: AppDispatch) => {
  dispatch(addMessages(msgs));
  // try {
  //   const res = await api.get(`/projects/${projectId}/messages`);
  //   const data = res.data;
  //   if (Array.isArray(data)) {
  //     dispatch(addMessages(data));
  //   } else if (data && Array.isArray(data.messages)) {
  //     dispatch(addMessages(data.messages));
  //   }
  // } catch (err) {
  //   return err;
  // }
};