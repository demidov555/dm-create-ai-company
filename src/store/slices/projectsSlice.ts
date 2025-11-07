import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { VITE_API_URL } from "../../../configs/env";

export interface ProjectSummary {
  projectId: number;
  agentCount: number;
  description: string;
  lastUpdated: string;
  name: string;
  status: "idle" | "loading" | "succeeded" | "failed";
}

interface ProjectsState {
  list: ProjectSummary[];
  createdProjectId: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProjectsState = {
  list: [],
  createdProjectId: null,
  status: "idle",
  error: null,
};

export const fetchProjects = createAsyncThunk<
  ProjectSummary[],
  void,
  { rejectValue: string }
>("projects/fetchAll", async (_, { rejectWithValue }) => {
  try {
  const response = await api.get(`/projects`);
  return response.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch projects");
  }
});

export const deleteProject = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>("projects/delete", async (id, { rejectWithValue }) => {
  try {
  await api.delete(`/projects${id}`);
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch projects");
  }
});

export const addProject = createAsyncThunk<
  number,
  any,
  { rejectValue: string }
>("projects/create", async (body, { rejectWithValue }) => {
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
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<ProjectSummary[]>) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      })

      .addCase(addProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action: PayloadAction<number>) => {
        state.status = "succeeded";
        state.createdProjectId = action.payload;
      })
      .addCase(addProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      })
  },
});

export default projectsSlice.reducer;
