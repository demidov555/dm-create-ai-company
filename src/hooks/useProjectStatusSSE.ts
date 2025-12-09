import { useCallback, useEffect } from "react";
import { SSEService } from "@services/sse";
import { useAppDispatch } from "@store/hooks";

import {
  updateProjectStatus,
  updateProjectProgress,
  updateAgentStatus,
} from "@store/slices/projectStatusSlice";

import { VITE_API_URL } from "@configs/env";

export const sseService = new SSEService();

export function useProjectStatusSSE({ projectId }) {
  const dispatch = useAppDispatch();

  const handleMessage = useCallback(
    (data: any) => {
      if (!data.type) return;

      switch (data.type) {
        case "project_status":
          dispatch(updateProjectStatus(data.status));
          dispatch(updateProjectProgress({ percent: data.progress, lastUpdate: data.lastUpdate }));
          break;

        case "agent_status":
          dispatch(updateAgentStatus(data));
          break;

        default:
          break;
      }
    },
    [dispatch]
  );

  const handleError = useCallback((err) => {
    console.warn("SSE projectStatus error:", err);
  }, []);

  const handleEnd = useCallback(() => {
    console.log("SSE projectStatus END");
  }, []);

  const start = useCallback(() => {
    console.log("▶️ Subscribing project status SSE");
    sseService.off();

    sseService.on("project_status", handleMessage);
    sseService.on("agent_status", handleMessage);
    sseService.on("error", handleError);
    sseService.on("end", handleEnd);
  }, [handleMessage, handleError, handleEnd]);

  const stop = useCallback(() => {
    console.log("⏹ Stop project status SSE listeners");
    sseService.off();
  }, []);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const url = `${VITE_API_URL}/projects/${projectId}/status/stream`;
    sseService.connect(url);
    start();

    return () => {
      console.log("🔌 Closing status project SSE");
      sseService.off();
      sseService.close();
    };
  }, [projectId, start]);

  return { start, stop };
}
