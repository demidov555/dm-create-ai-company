import { useLayoutEffect, useRef } from "react";
import { Message } from "@store/slices/chatSlice";

export function useChatScroll(messages: Message[]) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || messages.length === 0) return;

    const last = messages[messages.length - 1];

    if (last.role === "user") {
      requestAnimationFrame(() => {
        el.scrollTo({
          top: el.clientHeight,
          behavior: "smooth",
        });
      });
    }

  }, [messages.length]);

  return { scrollRef };
}
