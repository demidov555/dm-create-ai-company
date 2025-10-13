import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "idle" | "working" | "completed";
  currentTask?: string;
  projectId?: string;
}

export interface Message {
  id: string;
  sender: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
  projectId: string;
}

interface AgentsState {
  agents: Agent[];
  messages: Message[];
}

const initialState: AgentsState = {
  agents: [
    {
      id: "1",
      name: "AI Продукт-менеджер",
      role: "Координация команды и распределение задач",
      status: "working",
      currentTask: "Анализ требований и создание технического задания",
    },
    {
      id: "2",
      name: "AI Дизайнер",
      role: "UI/UX дизайн и прототипирование",
      status: "working",
      currentTask: "Разработка дизайн-системы и компонентов",
    },
    {
      id: "3",
      name: "AI Frontend разработчик",
      role: "Разработка интерфейса",
      status: "idle",
    },
    {
      id: "4",
      name: "AI Backend разработчик",
      role: "Серверная логика и API",
      status: "idle",
    },
    {
      id: "5",
      name: "AI QA инженер",
      role: "Тестирование и контроль качества",
      status: "idle",
    },
  ],
  messages: [
    {
      id: "1",
      sender: "Вы",
      role: "user",
      content: "Создайте e-commerce платформу с корзиной и оплатой",
      timestamp: "10:30",
      projectId: "1",
    },
    {
      id: "2",
      sender: "AI Продукт-менеджер",
      role: "agent",
      content:
        "Понял задачу. Разбиваю на подзадачи: дизайн, frontend, backend, интеграция платежей. Начинаем работу.",
      timestamp: "10:31",
      projectId: "1",
    },
    {
      id: "3",
      sender: "AI Дизайнер",
      role: "agent",
      content:
        "Создаю макеты главной страницы, каталога товаров и корзины. Использую современный минималистичный стиль.",
      timestamp: "10:35",
      projectId: "1",
    },
  ],
};

const agentsSlice = createSlice({
  name: "agents",
  initialState,
  reducers: {
    updateAgentStatus: (
      state,
      action: PayloadAction<{
        agentId: string;
        status: "idle" | "working" | "completed";
        currentTask?: string;
      }>
    ) => {
      const agent = state.agents.find((a) => a.id === action.payload.agentId);
      if (agent) {
        agent.status = action.payload.status;
        if (action.payload.currentTask !== undefined) {
          agent.currentTask = action.payload.currentTask;
        }
      }
    },
    addMessage: (
      state,
      action: PayloadAction<{
        sender: string;
        role: "user" | "agent";
        content: string;
        projectId: string;
      }>
    ) => {
      const newMessage: Message = {
        id: String(Date.now()),
        ...action.payload,
        timestamp: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      state.messages.push(newMessage);
    },
    clearMessagesForProject: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(
        (m) => m.projectId !== action.payload
      );
    },
    assignAgentToProject: (
      state,
      action: PayloadAction<{ agentId: string; projectId: string }>
    ) => {
      const agent = state.agents.find((a) => a.id === action.payload.agentId);
      if (agent) {
        agent.projectId = action.payload.projectId;
      }
    },
    resetAgent: (state, action: PayloadAction<string>) => {
      const agent = state.agents.find((a) => a.id === action.payload);
      if (agent) {
        agent.status = "idle";
        agent.currentTask = undefined;
        agent.projectId = undefined;
      }
    },
  },
});

export const {
  updateAgentStatus,
  addMessage,
  clearMessagesForProject,
  assignAgentToProject,
  resetAgent,
} = agentsSlice.actions;

export default agentsSlice.reducer;
