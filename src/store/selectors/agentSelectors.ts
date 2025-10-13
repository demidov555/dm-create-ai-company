import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Базовые селекторы
export const selectAgents = (state: RootState) => state.agents.agents;
export const selectMessages = (state: RootState) => state.agents.messages;

// Мемоизированные селекторы
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

export const selectMessagesByProject = (projectId: string) =>
  createSelector([selectMessages], (messages) =>
    messages.filter((m) => m.projectId === projectId)
  );

export const selectWorkingAgentsCount = createSelector(
  [selectAgents],
  (agents) => agents.filter((a) => a.status === "working").length
);

export const selectRecentMessages = (limit: number = 5) =>
  createSelector([selectMessages], (messages) =>
    messages.slice(-limit)
  );
