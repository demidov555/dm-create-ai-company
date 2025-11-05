import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addMessage, setConnected, setLoading } from "../store/slices/chatSlice";
import { sseService } from "../services/sse";

export function useChatSSE(url: string) {
  const dispatch = useDispatch();

  useEffect(() => {
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      const eventSource = sseService.connect(url);

      eventSource.onopen = () => {
        dispatch(setConnected(true));
        console.log("[SSE] Connected");
      };

      eventSource.onerror = () => {
        console.error("[SSE] Error or connection closed");
        dispatch(setConnected(false));

        // Если соединение закрыто — пробуем переподключиться
        if (eventSource.readyState === EventSource.CLOSED) {
          reconnectTimeout = setTimeout(connect, 3000);
        }
      };

      eventSource.onmessage = (event: any) => {
        try {
          const msg = JSON.parse(event.data);
          dispatch(addMessage(msg));
          dispatch(setLoading(false));
        } catch (err) {
          console.error("[SSE] JSON parse error:", err);
        }
      };
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      sseService.close();
      dispatch(setConnected(false));
      console.log("[SSE] Disconnected");
    };
  }, [url, dispatch]);
}
