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

    const lastAgent = [...messages].reverse().find((m) => m.role === "agent");

    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)}>
        {messages.length > 0 ? (
          messages.map((msg, i) => {
            const isAgent = msg.role === "agent";
            const isLastAgent =
              isAgent && lastAgent?.messageId === msg.messageId;

            return (
              <div
                key={i}
                data-role={msg.role}
                className={cn(
                  "flex gap-3 [overflow-anchor:none]",
                  msg.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "flex-1 pr-3",
                    msg.role === "user" && "text-right"
                  )}
                >
                  <p
                    className={cn(
                      "text-left break-words text-sm text-foreground/90 rounded-lg p-3 inline-block max-w-[80%] whitespace-pre-wrap",
                      msg.role === "user" ? "bg-secondary/50" : ""
                    )}
                  >
                    {isAgent && isLastAgent ? (
                      <AnimatedMessage text={msg.message} />
                    ) : (
                      msg.message
                    )}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 text-sm mt-10">
            <span className="text-foreground">Начните с описания задачи</span>
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

        {/* SCROLL ANCHOR — критично нужен при SSE */}
        <div id="scroll-anchor" className="[overflow-anchor:auto] h-[1px]"></div>

        {/* Prompt dialogs */}
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
