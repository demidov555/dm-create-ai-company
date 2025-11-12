import { forwardRef } from "react";
import { Message } from "../../store/slices/chatSlice";
import { Terminal, User, SearchCode } from "lucide-react";
import { Button } from "@ui/button";
import { PromptDialog } from "./PromptDialog";
import { useDispatch } from "react-redux";
import { openDialog } from "../../store/slices/uiSlice";
import {
  DETAILED_PROMPT_TEMPLATE,
  READY_LANDING_PROMPT,
  USER_FRIENDLY_PROMPT_TEMPLATE,
} from "./prompts";
import { cn } from "@ui/utils";
import { AnimatedMessage } from "./AnimatedMessage";

export interface MessageListProps {
  messages: Message[];
  className?: string;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  function MessageList({ messages, className }, ref) {
    const dispatch = useDispatch();

    const openPromptDialog = (type: string) => {
      dispatch(openDialog(type));
    };

    const lastAgentMessage = [...messages].reverse().find((m) => m.role === "agent");

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-4",
          className
        )}
      >
        {/* === Сообщения === */}
        {messages.length > 0 ? (
          messages.map((message, i) => {
            const isAgent = message.role === "agent";
            const isLastAgent =
              isAgent &&
              lastAgentMessage &&
              message.messageId === lastAgentMessage.messageId;

            return (
              <div
                key={i}
                data-role={message.role}
                className={cn(
                  "flex gap-3 transition-all duration-200",
                  message.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "flex-1 pr-3",
                    message.role === "user" && "text-right"
                  )}
                >
                  <p
                    className={cn(
                      "text-left break-words text-sm text-foreground/90 rounded-lg p-3 inline-block max-w-[80%] whitespace-pre-wrap",
                      message.role === "user" ? "bg-secondary/50" : ""
                    )}
                  >
                    {isAgent && isLastAgent ? (
                      <AnimatedMessage text={message.message} />
                    ) : (
                      message.message
                    )}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          /* === Пустой чат === */
          <div className="flex flex-col items-center justify-center gap-6 text-sm mt-10">
            <span className="text-foreground">
              Начните с описания задачи продукт менеджеру
            </span>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => openPromptDialog("detaildPrompt")}
              >
                <Terminal className="h-4 w-4 mr-2" />
                Детальный промпт
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => openPromptDialog("userFrendlyPrompt")}
              >
                <SearchCode className="h-4 w-4 mr-2" />
                Простой промпт
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => openPromptDialog("readyPrompt")}
              >
                <User className="h-4 w-4 mr-2" />
                Готовый промпт
              </Button>
            </div>
          </div>
        )}

        {/* === Диалоги промптов === */}
        <PromptDialog
          promptProp={DETAILED_PROMPT_TEMPLATE}
          type="detaildPrompt"
        />
        <PromptDialog
          promptProp={USER_FRIENDLY_PROMPT_TEMPLATE}
          type="userFrendlyPrompt"
        />
        <PromptDialog
          promptProp={READY_LANDING_PROMPT}
          type="readyPrompt"
        />
      </div>
    );
  }
);

export default MessageList;
