import { useEffect, useRef } from "react";
import { Message } from "../../store/slices/chatSlice";
import { ScrollArea } from "../ui/scroll-area";
import { Loader2 } from "lucide-react";

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const lastMsgRef = useRef<HTMLDivElement | null>(null);
  const prevLenRef = useRef<number>(messages.length);

  useEffect(() => {
    requestAnimationFrame(() => lastMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));

    prevLenRef.current = messages.length;
  }, [messages]);

  return (
    <ScrollArea className="h-[400px] p-4">
      <div className="space-y-4">
        {messages.map((message, i) => {
          const isLast = i === messages.length - 1;
          return (
            <div
              key={i}
              ref={isLast ? lastMsgRef : undefined}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`flex-1 ${message.role === "user" ? "text-right" : ""}`}>
                <p
                  className={`text-sm text-foreground/90 rounded-lg p-3 inline-block max-w-[80%] whitespace-break-spaces ${message.role === "user" ? "bg-secondary/50" : ""
                    }`}
                >
                  {message.message}
                </p>
              </div>
            </div>
          );
        })}

        {isLoading && (<Loader2 className="h-4 w-4 animate-spin text-blue-600" />)}
      </div>
    </ScrollArea>
  );
}
