import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectAgentsState = (state: RootState) => state.agents;

export const selectAgents = createSelector(selectAgentsState, (agentState) => agentState.agents);
export const selectIsLoadingAgentList = createSelector(selectAgentsState, (agentState) => agentState.isLoadingList);

