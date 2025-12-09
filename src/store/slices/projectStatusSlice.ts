import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AgentLiveState } from "./agentsSlice";

export enum AgentStatusEnum {
  IDLE = "idle",
  WORKING = "working",
  WAITING = "waiting",
  COMPLETED = "completed",
  ERROR = "error",
}

export const AgentStatusRU: Record<AgentStatusEnum, string> = {
  [AgentStatusEnum.IDLE]: "Ожидает",
  [AgentStatusEnum.WORKING]: "Работает",
  [AgentStatusEnum.WAITING]: "Ждёт",
  [AgentStatusEnum.COMPLETED]: "Готово",
  [AgentStatusEnum.ERROR]: "Ошибка",
};

export enum AgentTaskEnum {
  NONE = "none",
  ANALYZING_SPEC = "analyzing_spec",
  GENERATING_CODE = "generating_code",
  VALIDATING_CODE = "validating_code",
  FINALIZING = "finalizing",
}

export const AgentTaskRU: Record<AgentTaskEnum, string> = {
  [AgentTaskEnum.NONE]: "Без задачи",
  [AgentTaskEnum.ANALYZING_SPEC]: "Анализирует ТЗ",
  [AgentTaskEnum.GENERATING_CODE]: "Генерирует код",
  [AgentTaskEnum.VALIDATING_CODE]: "Проверяет проект",
  [AgentTaskEnum.FINALIZING]: "Завершил работу",
};

export enum ProjectStatusEnum {
  IDLE = "idle",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  ERROR = "error",
}

export const ProjectStatusRU: Record<ProjectStatusEnum, string> = {
  [ProjectStatusEnum.IDLE]: "Не запущен",
  [ProjectStatusEnum.IN_PROGRESS]: "В процессе",
  [ProjectStatusEnum.COMPLETED]: "Завершён",
  [ProjectStatusEnum.ERROR]: "Ошибка",
};

export interface ProjectProgress {
  lastUpdate: string;
  percent: number;
}

export interface ProjectStatusState {
  projectStatus: ProjectStatusEnum;
  projectProgress: ProjectProgress;
  agents: Record<string, AgentLiveState>;
}

const initialState: ProjectStatusState = {
  projectStatus: ProjectStatusEnum.IDLE,
  projectProgress: {
    lastUpdate: null,
    percent: 0,
  },
  agents: {}
};

const slice = createSlice({
  name: "projectStatus",
  initialState,
  reducers: {
    updateProjectStatus(state, action: PayloadAction<ProjectStatusEnum>) {
      state.projectStatus = action.payload;
    },

    updateProjectProgress(state, action: PayloadAction<ProjectProgress>) {
      state.projectProgress.percent = action.payload.percent;
      state.projectProgress.lastUpdate = action.payload.lastUpdate;
    },

    updateAgentStatus(
      state,
      action: PayloadAction<{
        agent_id: string;
        status: AgentStatusEnum;
        current_task?: AgentTaskEnum
        progress?: number;
      }>
    ) {
      const { agent_id, status, current_task, progress } = action.payload;

      if (!state.agents[agent_id]) {
        state.agents[agent_id] = {} as AgentLiveState;
      }

      state.agents[agent_id].status = status;
      if (current_task !== undefined)
        state.agents[agent_id].current_task = current_task;
      if (progress !== undefined)
        state.agents[agent_id].progress = progress;
    },

    // updateAgentLiveStatus(
    //   state,
    //   action: PayloadAction<{
    //     agent_id: string;
    //     status: AgentStatusEnum;
    //     current_task?: AgentTaskEnum
    //   }>
    // ) {
    //   const { agent_id, status, current_task } = action.payload;

    //   if (!state.agents[agent_id]) {
    //     state.agents[agent_id] = {} as AgentLiveState;
    //   }

    //   state.agents[agent_id].status = status;
    //   state.agents[agent_id].current_task = current_task ?? null;
    // },

    updateAgentLiveProgress(
      state,
      action: PayloadAction<{
        agent_id: string;
        progress: number;
        stage?: string;
      }>
    ) {
      const { agent_id, progress, stage } = action.payload;

      if (!state.agents[agent_id]) {
        state.agents[agent_id] = {} as AgentLiveState;
      }

      state.agents[agent_id].progress = progress;
      if (stage !== undefined) state.agents[agent_id].stage = stage;
    }
  }
});

export const {
  updateProjectStatus,
  updateProjectProgress,
  updateAgentStatus,
} = slice.actions;

export default slice.reducer;
