import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@services/api";
import { notificationService } from "@services/notification";
import { AgentStatusEnum, AgentTaskEnum } from "./projectStatusSlice";


export type AgentLiveState = {
  status: AgentStatusEnum;
  current_task?: AgentTaskEnum
  progress?: number;
  stage?: string;
};

export interface Agent {
  projectId: string;
  agentId: string;
  currentTask: AgentTaskEnum;
  name: string;
  role: string;
  status: AgentStatusEnum;
  required: boolean;
}

interface AgentsState {
  agents: Agent[];
  isLoadingList: boolean;
}

const initialState: AgentsState = {
  agents: [],
  isLoadingList: false,
};

const agentsSlice = createSlice({
  name: "agents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAgentByIds.pending, (state) => {
        state.isLoadingList = true;
      })
      .addCase(getAgentByIds.fulfilled, (state, action) => {
        state.agents = [];
        state.agents.push(...action.payload);
        state.isLoadingList = false;
      })
      .addCase(getAgentByIds.rejected, (state, action) => {
        state.isLoadingList = false;
        notificationService.error('Ошибка при получении агентов');
      })

      .addCase(getAgents.pending, (state) => {
        state.isLoadingList = true;
      })
      .addCase(getAgents.fulfilled, (state, action) => {
        state.agents = [];
        state.agents.push(...action.payload);
        state.isLoadingList = false;
      })
      .addCase(getAgents.rejected, (state, action) => {
        state.isLoadingList = false;
        notificationService.error('Ошибка при получении агентов');
      })
  },
});

export const getAgentByIds = createAsyncThunk<Agent[], { projectId: string, agentIds: string[] }, { rejectValue: string }>(
  'agents/getAgentsByIds',
  async ({ projectId, agentIds }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/agents/by_ids`, { project_id: projectId, agent_ids: agentIds });

      return res.data.list;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

export const getAgents = createAsyncThunk<Agent[], void, { rejectValue: string }>(
  'agents/getAgents',
  async (_, { rejectWithValue }) => {

    try {
      const res = await api.get(`/agents/available`);

      return res.data.list;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

export const {

} = agentsSlice.actions;

export default agentsSlice.reducer;
