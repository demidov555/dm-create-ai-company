import { RootState } from "../store";
import { ProjectSummary } from "../slices/projectsSlice";

export const selectProjects = (state: RootState): ProjectSummary[] => state.projects.list;
export const selectProjectsStatus = (state: RootState) => state.projects.status;
export const selectProjectsError = (state: RootState) => state.projects.error;

export const selectProjectsByStatus = (status: string) => (state: RootState) =>
  state.projects.list.filter((p) => p.status === status);

export const selectProjectsCount = (state: RootState) => state.projects.list.length;
