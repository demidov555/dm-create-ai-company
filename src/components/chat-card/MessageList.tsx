import { useEffect, useRef } from "react";
import { Message } from "../../store/slices/chatSlice";
import { ScrollArea } from "@ui/scroll-area";
import { Loader2, SearchCode, Terminal, User } from "lucide-react";
import { Button } from "@ui/button";
import { PromptDialog } from "./PromptDialog";
import { useDispatch } from "react-redux";
import { openDialog } from "../../store/slices/uiSlice";
import { DETAILED_PROMPT_TEMPLATE, READY_LANDING_PROMPT, USER_FRIENDLY_PROMPT_TEMPLATE } from "./prompts";

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const dispatch = useDispatch();
  const lastMsgRef = useRef<HTMLDivElement | null>(null);
  const prevLenRef = useRef<number>(messages.length);

  useEffect(() => {
    requestAnimationFrame(() => lastMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));

    prevLenRef.current = messages.length;
  }, [messages]);

  const openPromptDialog = (typeDialog: string) => {
    dispatch(openDialog(typeDialog));
  }

  return (
    <>
      <ScrollArea className="h-[80vh]">
        <div className={!messages.length ? "flex justify-center items-center space-y-4 h-[80vh]" : "space-y-4 h-[80vh]"}>
          {messages.map((message, i) => {
            const isLast = i === messages.length - 1;
            return (
              <div
                key={i}
                ref={isLast ? lastMsgRef : undefined}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`flex-1 pr-3 ${message.role === "user" ? "text-right" : ""}`}>
                  <p
                    className={`text-left break-all text-sm text-foreground/90 rounded-lg p-3 inline-block max-w-[80%] whitespace-break-spaces ${message.role === "user" ? "bg-secondary/50" : ""
                      }`}
                  >
                    {message.message}
                  </p>
                </div>
              </div>
            );
          })}

          {!messages.length && (
            <div className="flex flex-col items-center justify-center gap-6 text-sm">
              <span className="text-foreground">
                Начните с описания задачи продукт менеджеру
              </span>

              <div className="flex gap-4">
                <Button variant="secondary" size="lg" className="" onClick={() => openPromptDialog('detaildPrompt')}>
                  <Terminal className="h-4 w-4 mr-2" />
                  Детальный промпт
                </Button>
                <Button variant="secondary" size="lg" className="" onClick={() => openPromptDialog('userFrendlyPrompt')}>
                  <SearchCode className="h-4 w-4 mr-2" />
                  Простой промпт
                </Button>
                <Button variant="secondary" size="lg" className="" onClick={() => openPromptDialog('readyPrompt')}>
                  <User className="h-4 w-4 mr-2" />
                  Готовый промпт
                </Button>
              </div>
            </div>
          )}

          {isLoading && (<Loader2 className="h-4 w-4 animate-spin text-blue-600" />)}
        </div>
      </ScrollArea>

      <PromptDialog promptProp={DETAILED_PROMPT_TEMPLATE} type="detaildPrompt" />
      <PromptDialog promptProp={USER_FRIENDLY_PROMPT_TEMPLATE} type="userFrendlyPrompt" />
      <PromptDialog promptProp={READY_LANDING_PROMPT} type="readyPrompt" />
    </>
  );
}
