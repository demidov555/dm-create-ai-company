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
import { AiMarkdown } from "./AiMarkdown";

export interface MessageListProps {
  messages: Message[];
  projectId: string;
  userId: number;
  className?: string;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  function MessageList({ messages, projectId, userId, className }, ref) {
    const dispatch = useDispatch();

    const openPromptDialog = (type: string) => {
      dispatch(openDialog(type));
    };

    const UserMessage = ({ msg }: { msg: Message }) => (
      <div className="flex justify-end text-foreground/90 max-w-[80%] pr-4">
        <div className="p-3 bg-secondary/50 text-sm text-left rounded-lg whitespace-break-spaces">
          {msg.message}
        </div>
      </div>
    );

    const AssistantMessage = ({ msg }: { msg: Message }) => (
      <div className="pr-4 w-full min-w-0">
        <div className="flex flex-col max-w-5xl min-w-0">
          <AiMarkdown id={msg.messageId} content={msg.message} />
        </div>
      </div>
    );

    const MessageItem = ({ msg }: { msg: Message }) => (
      <div
        data-role={msg.role}
        className={cn(
          "flex [overflow-anchor:none]",
          msg.role === "user" && "flex-row-reverse"
        )}
      >
        {msg.role === "user" ? (
          <UserMessage msg={msg} />
        ) : (
          <AssistantMessage msg={msg} />
        )}
      </div>
    );

    const PromptButtons = () => (
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

        <Button
          variant="secondary"
          size="lg"
          onClick={() => openPromptDialog("common")}
        >
          <User className="h-4 w-4 mr-2" />
          common промпт
        </Button>
      </div>
    );

    const EmptyState = () => (
      <div className="flex flex-col items-center justify-center gap-6 text-sm mt-10">
        <span className="text-foreground">Начните с описания задачи</span>
        <PromptButtons />
      </div>
    );

    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)}>
        {messages.length > 0 ? (
          messages.map((msg, i) => <MessageItem key={i} msg={msg} />)
        ) : (
          <EmptyState />
        )}

        <div id="scroll-anchor" className="[overflow-anchor:auto] h-[1px]" />

        <PromptDialog
          projectId={projectId}
          userId={userId}
          promptProp={DETAILED_PROMPT_TEMPLATE}
          type="detaildPrompt"
        />
        <PromptDialog
          projectId={projectId}
          userId={userId}
          promptProp={USER_FRIENDLY_PROMPT_TEMPLATE}
          type="userFrendlyPrompt"
        />
        <PromptDialog
          projectId={projectId}
          userId={userId}
          promptProp={READY_LANDING_PROMPT}
          type="readyPrompt"
        />
        <PromptDialog
          projectId={projectId}
          userId={userId}
          promptProp="Напиши мне текст чтобы в нем были все кейсы markdown и + добавь обычный рыбу текст в конце просто по параграфам как обычный ответ"
          type="common"
        />
      </div>
    );
  }
);

export default MessageList;
