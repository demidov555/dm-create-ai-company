import { useEffect, useRef, useState } from "react";

/**
 * Простая анимация появления текста для SSE-чанков (Tailwind-only).
 * Без фликера, без перерисовок — просто плавное fade+slide вниз.
 */
export const AnimatedMessage = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setDisplayed(text);

    // Перезапускаем анимацию каждый раз, когда приходит новый чанк
    if (ref.current) {
      ref.current.classList.remove("animate-fadeIn");
      // заставляем браузер “перечитать” DOM, чтобы сбросить анимацию
      void ref.current.offsetWidth;
      ref.current.classList.add("animate-fadeIn");
    }
  }, [text]);

  return (
    <span
      ref={ref}
      className="block whitespace-pre-wrap animate-fadeIn"
    >
      {displayed}
    </span>
  );
};
