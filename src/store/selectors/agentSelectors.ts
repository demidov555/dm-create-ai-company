import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectAgents = (state: RootState) => state.agents.agents;

export const selectAgentById = (agentId: string) =>
  createSelector([selectAgents], (agents) =>
    agents.find((a) => a.id === agentId)
  );

export const selectAgentsByStatus = (
  status: "idle" | "working" | "completed"
) =>
  createSelector([selectAgents], (agents) =>
    agents.filter((a) => a.status === status)
  );

export const selectAgentsByProject = (projectId: string) =>
  createSelector([selectAgents], (agents) =>
    agents.filter((a) => a.projectId === projectId)
  );

export const selectWorkingAgentsCount = createSelector(
  [selectAgents],
  (agents) => agents.filter((a) => a.status === "working").length
);
