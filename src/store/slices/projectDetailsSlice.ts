import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";

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
  messages: {
    projectId: number | string;
    userId: number;
    timestamp?: string;
    role: string;
    message: string;
  }[];
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
    messages: [
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
    ]
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

export const sendMessage = createAsyncThunk<
  any,
  number,
  { rejectValue: string }
>("projectDetails/sendMessage", async (projectId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/send_message/${projectId}`);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch");
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
      })
      .addCase(sendMessage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.project.messages = action.payload;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });
  },
});

export const { clearProjectDetails } = projectDetailsSlice.actions;
export default projectDetailsSlice.reducer;
