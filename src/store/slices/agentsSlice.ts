import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "idle" | "working" | "completed";
  currentTask?: string;
  projectId?: string;
}

interface AgentsState {
  agents: Agent[];
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
  assignAgentToProject,
  resetAgent,
} = agentsSlice.actions;

export default agentsSlice.reducer;
