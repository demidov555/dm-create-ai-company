import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { CommonError } from "../../services/api";
import { notificationService } from "@services/notification";

export interface ProjectDetailsInfo {
  projectId: string;
  shortId: string;
  name: string;
  description: string;
  status: string;
  agentIds: string[];
  lastUpdated: string;
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

export interface ProjectSettingsInfo {
  name: string;
  description: string;
}

interface ProjectDetailsState {
  project: ProjectDetailsInfo;
  isLoadingProject: boolean;
  isLoadingUpdateProject: boolean;
  error: CommonError
}

const initialState: ProjectDetailsState = {
  project: {
    projectId: null,
    shortId: null,
    name: null,
    description: null,
    status: null,
    agentIds: [],
    lastUpdated: null,
    metrica: {
      progress: {
        percent: 0,
        lastUpdate: null,
      },
      componentCounter: 0,
      codeStringCoutner: 0,
      testOverageCouter: 0,
    },
  },
  isLoadingProject: false,
  isLoadingUpdateProject: false,
  error: null,
};

const projectDetailsSlice = createSlice({
  name: "projectDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProject.pending, (state) => {
        state.error = null;
        state.isLoadingProject = true;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.isLoadingProject = false;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoadingProject = false;
      })
      .addCase(refetchProject.pending, (state, action) => {
        state.error = null;
      })
      .addCase(refetchProject.fulfilled, (state, action) => {
        state.project = action.payload;
      })
      .addCase(refetchProject.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateProject.pending, (state) => {
        state.isLoadingUpdateProject = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        notificationService.success('Настройки сохранены');
        state.isLoadingUpdateProject = false;
      })
      .addCase(updateProject.rejected, (state, action) => {
        notificationService.error('Ошибка сохранения');
        state.isLoadingUpdateProject = false;
      })
  },
});


export const fetchProject = createAsyncThunk<ProjectDetailsInfo, string, { rejectValue: CommonError }>("projectDetails/fetchProject", async (projectId, { rejectWithValue }) => {
  try {
    const data = await getProject(projectId);
    return data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const refetchProject = createAsyncThunk<ProjectDetailsInfo, string, { rejectValue: CommonError }>("projectDetails/refetchProject", async (projectId, { rejectWithValue }) => {
  try {
    const data = await getProject(projectId);
    return data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const updateProject = createAsyncThunk<void, Partial<ProjectSettingsInfo> & { projectId: string }, { rejectValue: string }>(
  'project/update',
  async ({ projectId, ...updates }: Partial<ProjectSettingsInfo> & { projectId: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/projects/${projectId}`, updates);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

async function getProject(projectId: string): Promise<ProjectDetailsInfo> {
  const response = await api.get(`/projects/${projectId}`);
  return response.data.projectInfo;
}

export default projectDetailsSlice.reducer;
