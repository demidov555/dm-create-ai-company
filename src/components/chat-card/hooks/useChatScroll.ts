import { useLayoutEffect, useRef } from "react";
import { Message } from "@store/slices/chatSlice";
import { localStorageService } from "@services/localStorageService";

export function useChatScroll(messages: Message[], projectId: string) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const STORAGE_KEY = `chat_scroll_position_${projectId}`;

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // --- 1. Восстановление позиции
    const saved = localStorageService.getItem(STORAGE_KEY);
    if (saved) {
      requestAnimationFrame(() => {
        el.scrollTo({
          top: Number(saved),
          behavior: "instant" as ScrollBehavior,
        });
      });
    }

    // --- 2. Сохраняем позицию при скролле
    const handleScroll = () => {
      localStorageService.setItem(STORAGE_KEY, el.scrollTop);
    };

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [projectId]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || messages.length === 0) return;

    const last = messages[messages.length - 1];

    // --- 3. Скроллим вниз только если последнее сообщение — от пользователя
    if (last.role === "user") {
      requestAnimationFrame(() => {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: "smooth",
        });

        // сохраняем новую позицию
        localStorageService.setItem(STORAGE_KEY, el.scrollHeight);
      });
    }
  }, [messages.length, projectId]);

  return { scrollRef };
}
