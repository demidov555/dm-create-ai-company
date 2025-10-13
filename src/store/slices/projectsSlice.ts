import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "active" | "completed" | "in-progress";
  agentCount: number;
  lastUpdated: string;
}

interface ProjectsState {
  projects: Project[];
  currentProjectId: string | null;
}

const initialState: ProjectsState = {
  projects: [
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Интернет-магазин с корзиной, оплатой и админ-панелью",
      status: "in-progress",
      agentCount: 5,
      lastUpdated: "2 часа назад",
    },
    {
      id: "2",
      name: "Portfolio Website",
      description: "Портфолио для дизайнера с галереей работ",
      status: "completed",
      agentCount: 3,
      lastUpdated: "1 день назад",
    },
    {
      id: "3",
      name: "SaaS Dashboard",
      description: "Аналитическая панель для B2B сервиса",
      status: "active",
      agentCount: 6,
      lastUpdated: "30 минут назад",
    },
  ],
  currentProjectId: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addProject: (
      state,
      action: PayloadAction<{
        name: string;
        description?: string;
        agentCount: number;
      }>
    ) => {
      const newProject: Project = {
        id: String(Date.now()),
        name: action.payload.name,
        description: action.payload.description,
        status: "active",
        agentCount: action.payload.agentCount,
        lastUpdated: "только что",
      };
      state.projects.unshift(newProject);
      state.currentProjectId = newProject.id;
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      if (state.currentProjectId === action.payload) {
        state.currentProjectId = null;
      }
    },
    updateProject: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Project> }>
    ) => {
      const project = state.projects.find((p) => p.id === action.payload.id);
      if (project) {
        Object.assign(project, action.payload.updates);
      }
    },
    setCurrentProject: (state, action: PayloadAction<string | null>) => {
      state.currentProjectId = action.payload;
    },
    updateProjectStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: "active" | "completed" | "in-progress";
      }>
    ) => {
      const project = state.projects.find((p) => p.id === action.payload.id);
      if (project) {
        project.status = action.payload.status;
        project.lastUpdated = "только что";
      }
    },
  },
});

export const {
  addProject,
  deleteProject,
  updateProject,
  setCurrentProject,
  updateProjectStatus,
} = projectsSlice.actions;

export default projectsSlice.reducer;
