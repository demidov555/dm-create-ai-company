import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectProjectStatusState = (state: RootState) => state.projectStatus;
export const selectProjectStatus = createSelector(selectProjectStatusState, (state) => state.projectStatus);
export const selectProjectProgress = createSelector(selectProjectStatusState, (state) => state.projectProgress);
export const selectAgentsStatusMap = createSelector(selectProjectStatusState, (state) => state.agents);
