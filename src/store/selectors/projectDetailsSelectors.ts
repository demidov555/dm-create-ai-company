import { RootState } from "../store";

export const selectProjectDetails = (state: RootState) => state.projectDetails.project;
export const selectProjectDetailsStatus = (state: RootState) => state.projectDetails.status;
export const selectProjectDetailsError = (state: RootState) => state.projectDetails.error;

export const selectAgents = (state: RootState) => state.agents.agents;
