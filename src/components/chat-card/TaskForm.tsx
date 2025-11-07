import { useState, useRef, useLayoutEffect } from "react";
import { ArrowUp } from "lucide-react";

function InputField({
  message,
  setMessage,
  isExpanded,
  setIsExpanded,
  onSubmit,
}: {
  message: string;
  setMessage: (msg: string) => void;
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  onSubmit: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
    if (e.key === "Enter" && e.shiftKey && !isExpanded) {
      e.preventDefault();
      const pos = (e.target as HTMLInputElement).selectionStart || 0;
      setMessage(message.slice(0, pos) + "\n" + message.slice(pos));
      setIsExpanded(true);
    }
  };

  useLayoutEffect(() => {
    if (isExpanded && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
      el.focus();
      el.setSelectionRange(message.length, message.length);
    }
  }, [isExpanded, message]);

  return (
    <>
      {!isExpanded && (
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Опишите задачу продукт менеджеру"
          className="
            w-full h-12 bg-background border border-input
            px-4 pr-14 text-foreground placeholder:text-muted-foreground
            rounded-full text-base
            outline-none ring-0 focus:outline-none focus:ring-0 focus:border-input
            transition-all duration-200
          "
          autoFocus
        />
      )}

      {isExpanded && (
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Напишите сообщение..."
          className="
            w-full min-h-12 max-h-48 resize-none
            bg-background border border-input
            px-4 py-3 pr-14 text-foreground placeholder:text-muted-foreground
            rounded-xl text-base leading-relaxed
            outline-none ring-0 focus:outline-none focus:ring-0 focus:border-input
            overflow-hidden transition-all duration-200
          "
          rows={1}
        />
      )}
    </>
  );
}

function SendButton({ isDisabled, isExpanded }: { isDisabled: boolean; isExpanded: boolean }) {
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`
        absolute flex items-center justify-center cursor-pointer
        h-9 w-9 p-0 rounded-full
        shadow-sm hover:shadow-md
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-blue-500/20
        ${isExpanded ? "bottom-3 right-3" : "right-2 top-1/2 -translate-y-1/2"}
        ${isDisabled
          ? "bg-muted/70 text-muted-foreground opacity-60"
          : "bg-gradient-to-r from-blue-500 to-blue-600 text-white opacity-100 hover:from-blue-600 hover:to-blue-700 hover:scale-105 active:scale-95"
        }
      `}
    >
      <ArrowUp className="h-4 w-4" />
      <span className="sr-only">Отправить</span>
    </button>
  );
}

export function TaskForm({ onSendMessage }: { onSendMessage: (msg: string) => void }) {
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      setIsExpanded(false);
    }
  };

  const isDisabled = !message.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="relative p-2"
    >
      <InputField
        message={message}
        setMessage={setMessage}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        onSubmit={handleSubmit}
      />

      <SendButton isDisabled={isDisabled} isExpanded={isExpanded} />
    </form>
  );
}