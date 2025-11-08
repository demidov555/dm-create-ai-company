import { useState, useRef, useLayoutEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export function TaskForm({ onSendMessage }: { onSendMessage: (msg: string) => void }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDisabled = !message.trim();

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="relative p-2"
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Опишите задачу продукт-менеджеру..."
        className={`
          w-full min-h-12 max-h-48 resize-none
          bg-secondary/50 border border-input
          px-4 py-3 pr-14 text-foreground placeholder:text-muted-foreground
          rounded-xl text-base leading-relaxed
          outline-none ring-0 focus:outline-none focus:ring-0 focus:border-input
          overflow-hidden transition-all duration-200
          field-sizing-content
        `}
        rows={1}
        autoFocus
      />

      <Button
        type="submit"
        disabled={isDisabled}
        className="absolute bottom-5 right-4 h-9 w-9 rounded-full"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </form>
  );
}