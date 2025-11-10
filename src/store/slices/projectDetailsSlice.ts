import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { notificationService } from "@services/notification";

const mockData = {
  projectInfo: {
    projectId: '1',
    name: 'Фабрика создания приложения',
    description: 'Платформа, предназначенная для быстрого и удобного создания цифровых продуктов с помощью ai. Она объединяет инструменты, шаблоны и процессы, позволяя разработчикам, командам и стартапам запускать веб- и мобильные приложения с минимальными затратами времени и ресурсов. Проект ориентирован на автоматизацию, гибкость и масштабируемость, превращая разработку в понятный и управляемый процесс.',
    status: 'in-progress',
    agent_count: 5,
    last_updated: '22.11.25',
  },
  agents: [
    {
      projectId: '1',
      agentId: '1',
      currentTask: 'Разрабатываю фронтенд на react',
      name: 'AI Frontend agent',
      role: 'Frontend разработчик',
      status: "working",
    },
    {
      projectId: '1',
      agentId: '2',
      currentTask: 'Разрабатываю backend на py',
      name: 'AI Backend agent',
      role: 'Backend разработчик',
      status: "working",
    },
    {
      projectId: '1',
      agentId: '3',
      currentTask: 'Пока нечего тестировать',
      name: 'AI QA agent',
      role: 'QA специалист',
      status: "completed",
    },
    {
      projectId: '1',
      agentId: '4',
      currentTask: 'Ожиданю разработчиков, чтобы поднять инфраструктуру',
      name: 'AI DevOps agent',
      role: 'DevOps специалист',
      status: "idle",
    }
  ],
  metrica: {
    progress: {
      percent: 10,
      lastUpdate: '22.11.25',
    },
    componentCounter: 15,
    codeStringCoutner: 490,
    testOverageCouter: 75,
  },
} as ProjectDetails;

export interface ProjectDetailsInfo {
  projectId: string;
  name: string;
  description: string;
  status: string;
  agent_count: number;
  last_updated: string;
}

export interface ProjectSettingsInfo {
  name: string;
  description: string;
}

export interface ProjectDetails {
  projectInfo: ProjectDetailsInfo,
  agents: {
    projectId: string;
    agentId: string;
    currentTask: string;
    name: string;
    role: string;
    status: "idle" | "working" | "completed";
  }[];
  metrica: {
    progress: {
      percent: number;
      lastUpdate: string;
    };
    componentCounter: number;
    codeStringCoutner: number;
    testOverageCouter: number;
  };
}

interface ProjectDetailsState {
  project: ProjectDetails;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProjectDetailsState = {
  project: {
    projectInfo: {} as any,
    agents: [],
    metrica: {} as any,
  },
  status: "idle",
  error: null,
};

export const fetchProject = createAsyncThunk<ProjectDetails, string, { rejectValue: string }>("projectDetails/fetch", async (projectId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch project details");
  }
});

export const updateProject = createAsyncThunk<void, Partial<ProjectSettingsInfo> & { projectId: string }, { rejectValue: string }>(
  'project/update',
  async ({ projectId, ...updates }: Partial<ProjectSettingsInfo> & { projectId: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/projects/${projectId}`, updates);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to update project");
    }
  }
);

export const deleteProject = createAsyncThunk<string, string, { rejectValue: string }>(
  'project/delete',
  async (projectId: string, { rejectWithValue }) => {

    try {
      await api.delete(`/projects/${projectId}`);
      return projectId;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to update project");
    }
  }
);

const projectDetailsSlice = createSlice({
  name: "projectDetails",
  initialState,
  reducers: {
    clearProjectDetails(state) {
      state.project = {} as any;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.project = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string || "Unknown error";
        state.project = mockData;
      })
      .addCase(updateProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        notificationService.success('Настройки сохранены');
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string || "Unknown error";
        notificationService.error('Ошибка сохранения');
      })
      .addCase(deleteProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        notificationService.success('Проект удален');
        window.location.href = '/projects';
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string || "Unknown error";
        notificationService.error('Ошибка удаления');
      })
  },
});

export const { clearProjectDetails } = projectDetailsSlice.actions;
export default projectDetailsSlice.reducer;
