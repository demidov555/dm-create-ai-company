import { RootState } from "../store";
import { ProjectSummary } from "../slices/projectsSlice";

export const selectProjects = (state: RootState): ProjectSummary[] => state.projects.list;
export const selectIsLoadingList = (state: RootState) => state.projects.isLoadingList;
export const selectIsLoadingCreateProject = (state: RootState) => state.projects.isLoadingCreateProject;
export const selectProjectsCount = (state: RootState) => state.projects.list.length;
