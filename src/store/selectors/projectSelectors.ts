import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Базовые селекторы
export const selectProjects = (state: RootState) => state.projects.projects;
export const selectCurrentProjectId = (state: RootState) =>
  state.projects.currentProjectId;

// Мемоизированные селекторы
export const selectCurrentProject = createSelector(
  [selectProjects, selectCurrentProjectId],
  (projects, currentProjectId) => {
    if (!currentProjectId) return null;
    return projects.find((p) => p.id === currentProjectId) || null;
  }
);

export const selectProjectById = (projectId: string) =>
  createSelector([selectProjects], (projects) =>
    projects.find((p) => p.id === projectId)
  );

export const selectProjectsByStatus = (
  status: "active" | "completed" | "in-progress"
) =>
  createSelector([selectProjects], (projects) =>
    projects.filter((p) => p.status === status)
  );

export const selectProjectsCount = createSelector(
  [selectProjects],
  (projects) => projects.length
);

export const selectActiveProjectsCount = createSelector(
  [selectProjects],
  (projects) => projects.filter((p) => p.status === "active").length
);
