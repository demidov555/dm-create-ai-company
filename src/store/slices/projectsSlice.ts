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
  isLoadingCreateProject: boolean,
  error: string;
}

const initialState: ProjectsState = {
  list: [],
  isLoadingList: false,
  isLoadingCreateProject: false,
  error: null,
};

export const fetchProjects = createAsyncThunk<ProjectSummary[], void, { rejectValue: string }>("projects/fetchProjects", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/projects`);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch projects");
  }
});

export const deleteProject = createAsyncThunk<void, number, { rejectValue: string }>("projects/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/projects${id}`);
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch projects");
  }
});

export const addProject = createAsyncThunk<number, any, { rejectValue: string }>("projects/create", async (body, { rejectWithValue }) => {
  try {
    const result = await api.post(`/project_create`, body);

    return result.data.projectId;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to create projects");
  }
});

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoadingList = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<ProjectSummary[]>) => {
        state.list = action.payload;
        state.isLoadingList = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoadingList = false;
        notificationService.error('Ошибка загрузки проектов');
      })

      .addCase(addProject.pending, (state) => {
        state.error = null;
        state.isLoadingCreateProject = true;
      })
      .addCase(addProject.fulfilled, (state, action: PayloadAction<number>) => {
        state.error = null;
        state.isLoadingCreateProject = false;
        notificationService.success('Проект создан');
      })
      .addCase(addProject.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoadingCreateProject = false;
        notificationService.error('Ошибка создания проекта');
      })
  },
});

export default projectsSlice.reducer;
