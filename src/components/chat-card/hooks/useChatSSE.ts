import { useEffect, useRef } from "react";
import { useAppDispatch } from "@store/hooks";
import {
  startStream,
  appendToCurrentStream,
  endStream,
} from "@store/slices/chatSlice";
import { sseService } from "@services/sse";
import { VITE_API_URL } from "@configs/env";

/**
 * Управляет подключением SSE для конкретного проекта.
 * Поддерживает единичное соединение и стриминг сообщений от агента.
 */
export function useChatSSE({ projectId, userId }: any) {
  const dispatch = useAppDispatch();
  const bufferMap = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const url = `${VITE_API_URL}/chat_stream/${projectId}`;
    sseService.connect(url);

    /** Обработка входящих сообщений */
    sseService.on("message", (data: any) => {
      if (data.role !== "agent") return;

      const id = data.message_id;
      const chunk = data.message || "";
      if (!id) return;

      const prev = bufferMap.current.get(id) || "";
      const next = prev + chunk;
      bufferMap.current.set(id, next);

      // Первый чанк нового ответа
      if (!prev) {
        dispatch(
          startStream({
            messageId: id,
            projectId,
            userId,
            role: "agent",
            message: chunk,
          })
        );
      } else {
        dispatch(appendToCurrentStream(chunk));
      }
    });

    /** Конец потока */
    sseService.on("end", (data: any) => {
      dispatch(endStream());
      bufferMap.current.delete(data?.message_id);
    });

    /** Очистка при размонтировании */
    return () => {
      sseService.close();
      bufferMap.current.clear();
    };
  }, [dispatch, projectId, userId]);
}