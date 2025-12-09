import { useEffect, useCallback } from "react";
import { useAppDispatch } from "@store/hooks";
import {
  startStream,
  appendToCurrentStream,
  endStream,
} from "@store/slices/chatSlice";
import { SSEService } from "@services/sse";
import { VITE_API_URL } from "@configs/env";
import { store } from "@store/store";

export const sseService = new SSEService();
const buffers: Record<string, string> = {};
const timers: Record<string, any> = {};

function batchAppend(dispatch, messageId: string, chunk: string, delay = 30) {
  if (!buffers[messageId]) buffers[messageId] = "";
  buffers[messageId] += chunk;

  if (timers[messageId]) return;

  timers[messageId] = setTimeout(() => {
    dispatch(
      appendToCurrentStream({
        messageId,
        chunk: buffers[messageId],
      })
    );

    buffers[messageId] = "";
    clearTimeout(timers[messageId]);
    timers[messageId] = null;
  }, delay);
}

export function useChatSSE({ projectId }) {
  const dispatch = useAppDispatch();

  /** ===========================
   *  SSE EVENT HANDLERS
   * ========================== */
  const handleMessage = useCallback(
    (data: any) => {
      if (data.role !== "agent") return;
      const messageId = data.message_id;
      if (!messageId) return;

      const chunk = data.message ?? "";
      const map = store.getState().chat.messageIndexMap;
      const isNewMessage = map[messageId] === undefined;

      if (isNewMessage) {
        dispatch(
          startStream({
            messageId,
            projectId,
            role: "agent",
            message: chunk,
          })
        );
      } else {
        batchAppend(dispatch, messageId, chunk);
      }
    },
    [dispatch, projectId]
  );

  const handleEnd = useCallback(() => dispatch(endStream()), [dispatch]);

  const handleCancel = useCallback(() => {
    dispatch(endStream());
    stop();
  }, [dispatch]);

  const handleError = useCallback(() => {
    stop();
  }, [dispatch]);

  /** ===========================
   *  START — навешиваем listeners
   * ========================== */
  const start = useCallback(() => {
    console.log("▶️ Subscribing SSE listeners");
    sseService.off();

    sseService.on("message", handleMessage);
    sseService.on("end", handleEnd);
    sseService.on("cancel", handleCancel);
    sseService.on("error", handleError);
  }, [handleMessage, handleEnd, handleCancel, handleError]);

  /** ===========================
   *  STOP — снять listeners, но НЕ закрывать SSE
   * ========================== */
  const stop = useCallback(() => {
    console.log("⏹ Stop CHAT SSE listeners");

    sseService.off();
    dispatch(endStream());
  }, []);

  /** ===========================
   *  RESTART — переподписка
   * ========================== */
  const restart = useCallback(() => {
    console.log("♻️ Restart SSE listeners");
    stop();
    start();
  }, [stop, start]);

  /** ===========================
   * LIFECYCLE
   * ========================== */
  useEffect(() => {
    if (!projectId) {
      return;
    }

    const url = `${VITE_API_URL}/chat_stream/${projectId}`;
    sseService.connect(url);

    start();

    return () => {
      console.log("🔌 Closing status project SSE");
      sseService.off();
      sseService.close();
    };
  }, [projectId, start]);

  return { start, stop, restart };
}
