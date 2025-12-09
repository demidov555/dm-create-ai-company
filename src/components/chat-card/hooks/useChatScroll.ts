import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { Message } from "@store/slices/chatSlice";
import { localStorageService } from "@services/localStorageService";

export function useChatScroll(messages: Message[], projectId: string) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  const STORAGE_KEY = `chat_scroll_position_${projectId}`;
  const BOTTOM_THRESHOLD = 600; // px — область, которая считается "внизу"

  // 📌 Скроллить вниз вручную
  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });

    localStorageService.setItem(STORAGE_KEY, el.scrollHeight);
  }, [STORAGE_KEY]);

  // 📌 Восстановление позиции + слушатель скролла
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const saved = localStorageService.getItem(STORAGE_KEY);
    if (saved) {
      requestAnimationFrame(() => {
        el.scrollTo({
          top: Number(saved),
          behavior: "instant" as ScrollBehavior,
        });
      });
    }

    const handleScroll = () => {
      if (!el) return;

      const isBottom =
        el.scrollHeight - (el.scrollTop + el.clientHeight) < BOTTOM_THRESHOLD;

      setIsScrolledUp(!isBottom);

      localStorageService.setItem(STORAGE_KEY, el.scrollTop);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [projectId]);

  // 📌 Автоскролл вниз только если сообщение от юзера
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || messages.length === 0) return;

    const last = messages[messages.length - 1];

    if (last.role === "user") {
      scrollToBottom();
    }
  }, [messages.length, projectId, scrollToBottom]);

  return {
    scrollRef,
    isScrolledUp,
    scrollToBottom,
  };
}
