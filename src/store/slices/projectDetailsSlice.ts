import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const mockData = {
  projectInfo: {
    projectId: 1,
    name: 'Фабрика создания приложения',
    description: 'Платформа, предназначенная для быстрого и удобного создания цифровых продуктов с помощью ai. Она объединяет инструменты, шаблоны и процессы, позволяя разработчикам, командам и стартапам запускать веб- и мобильные приложения с минимальными затратами времени и ресурсов. Проект ориентирован на автоматизацию, гибкость и масштабируемость, превращая разработку в понятный и управляемый процесс.',
    status: 'in-progress',
    agent_count: 5,
    last_updated: '22.11.25',
  },
  agents: [
    {
      projectId: 1,
      agentId: 1,
      currentTask: 'Разрабатываю фронтенд на react',
      name: 'AI Frontend agent',
      role: 'Frontend разработчик',
      status: "working",
    },
    {
      projectId: 1,
      agentId: 2,
      currentTask: 'Разрабатываю backend на py',
      name: 'AI Backend agent',
      role: 'Backend разработчик',
      status: "working",
    },
    {
      projectId: 1,
      agentId: 3,
      currentTask: 'Пока нечего тестировать',
      name: 'AI QA agent',
      role: 'QA специалист',
      status: "completed",
    },
    {
      projectId: 1,
      agentId: 4,
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

export interface ProjectDetails {
  projectInfo: {
    projectId: number | string;
    name: string;
    description: string;
    status: string;
    agent_count: number;
    last_updated: string;
  };
  agents: {
    projectId: number;
    agentId: number;
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

export const fetchProjectDetails = createAsyncThunk<
  ProjectDetails,
  number,
  { rejectValue: string }
>("projectDetails/fetch", async (projectId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch project details");
  }
});

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
      .addCase(fetchProjectDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.project = action.payload;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
        state.project = mockData;
      })
  },
});

export const { clearProjectDetails } = projectDetailsSlice.actions;
export default projectDetailsSlice.reducer;
