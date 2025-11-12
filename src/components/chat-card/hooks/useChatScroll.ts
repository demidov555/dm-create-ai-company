import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Message } from "@store/slices/chatSlice";

/**
 * useChatScroll
 *
 * 1️⃣ USER отправил сообщение:
 *     base = (Huser >= V ? 0.75*V : V - Huser)
 *     → скроллим вниз, чтобы сообщение было видно и снизу осталось место под ответ
 *
 * 2️⃣ AI печатает (контент растёт в [data-role="ai"]:last-of-type):
 *     reserve = max(0, base - Hai)
 *     → по мере роста текста отступ снизу уменьшается
 */
export function useChatScroll(messages: Message[]) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [reserveSpace, setReserveSpace] = useState(0);
  const baseReserveRef = useRef<number>(0);
  const observerRef = useRef<ResizeObserver | null>(null);

  const scrollToBottom = (reserve = 0, smooth = false) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight - reserve,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const getLastUserEl = () => {
    const el = scrollRef.current;
    if (!el) return null;
    const users = el.querySelectorAll('[data-role="user"]');
    return users.length > 0 ? users[users.length - 1] as HTMLElement : null;
  };

  const getLastAiEl = () => {
    const el = scrollRef.current;
    if (!el) return null;
    const agents = el.querySelectorAll('[data-role="agent"]');
    return agents.length > 0 ? agents[agents.length - 1] as HTMLElement : null;
  };

  // === CASE 1: пользователь отправил — вычисляем базовый резерв ===
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || messages.length === 0) return;

    const last = messages[messages.length - 1];
    if (last.role !== "user") return;

    requestAnimationFrame(() => {
      const viewport = el.clientHeight;
      const userEl = getLastUserEl();
      const userH = userEl ? userEl.getBoundingClientRect().height : 0;

      let base = 0;

      if (userH > viewport) {
        // длинное сообщение — не помещается во вьюпорт
        base = 0.75 * viewport;
        setReserveSpace(base);

        requestAnimationFrame(() => {
          // Скроллим вниз — показываем низ сообщения и резерв
          el.scrollTo({
            top: el.scrollHeight,
            behavior: "auto",
          });
        });
      } else {
        // короткое сообщение — помещается во вьюпорт
        base = Math.max(0, viewport - userH);
        setReserveSpace(base);

        requestAnimationFrame(() => {
          // Скроллим так, чтобы сообщение оказалось вверху, а внизу был резерв
          const messageBottom = userEl.offsetTop + userH;
          const targetScroll = messageBottom - userH; // позиция начала сообщения
          el.scrollTo({
            top: targetScroll,
            behavior: "auto",
          });
        });
      }

      baseReserveRef.current = base;
    });
  }, [messages]);


  // === CASE 2: AI печатает — следим за последним AI-блоком ===
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || messages.length === 0) return;

    const last = messages[messages.length - 1];
    if (last.role !== "agent") return;

    // ждём, пока React реально отрендерит div[data-role="agent"]
    requestAnimationFrame(() => {
      let ai = getLastAiEl();

      // если элемента ещё нет — пробуем повторно на следующем кадре
      if (!ai) {
        requestAnimationFrame(() => {
          ai = getLastAiEl();
          if (ai) observeAI(ai);
        });
      } else {
        observeAI(ai);
      }
    });

    function observeAI(aiEl: HTMLElement) {
      const el = scrollRef.current;
      if (!el) return;

      const recalc = () => {
        const el = scrollRef.current;
        if (!el) return;

        const V = el.clientHeight;
        const u = getLastUserEl();
        const Huser = u ? u.getBoundingClientRect().height : 0;
        const Hai = aiEl.getBoundingClientRect().height;

        let nextReserve = 0;

        if (Huser >= V) {
          // Длинное сообщение пользователя
          nextReserve = Math.max(0, 0.75 * V - Hai);
        } else {
          const totalVisible = Huser + Hai;
          nextReserve = totalVisible <= V ? Math.max(0, V - totalVisible) : 0;
        }

        setReserveSpace(nextReserve);
      };

      const ro = new ResizeObserver(() => requestAnimationFrame(recalc));
      ro.observe(aiEl);
      observerRef.current = ro;
    }

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [messages]);


  return { scrollRef, reserveSpace };
}
