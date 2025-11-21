import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectProjectDetailsState = (s: RootState) => s.projectDetails;
export const selectProjectDetails = createSelector(selectProjectDetailsState, (s) => s.project);
export const selectIsLoadingProjectDetails = createSelector(selectProjectDetailsState, (s) => s.isLoadingProject);
export const selectIsLoadingIsLoadingUpdateProject = createSelector(selectProjectDetailsState, (s) => s.isLoadingUpdateProject);
export const selectErrorProjectDetails = createSelector(selectProjectDetailsState, (s) => s.error);