import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@services/api";
import { notificationService } from "@services/notification";

export interface ProjectSummary {
  projectId: number;
  agentCount: number;
  description: string;
  lastUpdated: string;
  name: string;
}

interface ProjectsState {
  list: ProjectSummary[];
  isLoadingList: boolean;
  isLoadingActionProject: boolean,
}

const initialState: ProjectsState = {
  list: [],
  isLoadingList: false,
  isLoadingActionProject: false,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoadingList = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<ProjectSummary[]>) => {
        state.list = action.payload;
        state.isLoadingList = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoadingList = false;
        notificationService.error('Ошибка загрузки проектов');
      })

      .addCase(addProject.pending, (state) => {
        state.isLoadingActionProject = true;
      })
      .addCase(addProject.fulfilled, (state) => {
        state.isLoadingActionProject = false;
        notificationService.success('Проект создан');
      })
      .addCase(addProject.rejected, (state) => {
        state.isLoadingActionProject = false;
        notificationService.error('Ошибка создания проекта');
      })

      .addCase(deleteProject.pending, (state) => {
        state.isLoadingActionProject = true;
      })
      .addCase(deleteProject.fulfilled, (state) => {
        state.isLoadingActionProject = false;
        notificationService.success('Проект удален');
      })
      .addCase(deleteProject.rejected, (state) => {
        state.isLoadingActionProject = false;
        notificationService.error('Ошибка создания проекта');
      })
  },
});

export const fetchProjects = createAsyncThunk<ProjectSummary[], void, { rejectValue: string }>("projects/fetchProjects", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/projects`);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch projects");
  }
});

export const deleteProject = createAsyncThunk<void, string, { rejectValue: string }>("projects/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/projects/${id}`);
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch projects");
  }
});

export const addProject = createAsyncThunk<number, any, { rejectValue: string }>("projects/create", async (body, { rejectWithValue }) => {
  try {
    const result = await api.post(`/project_create`, body);

    return result.data.shortId;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to create projects");
  }
});

export default projectsSlice.reducer;
