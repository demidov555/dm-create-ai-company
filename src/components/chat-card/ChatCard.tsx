import { MessageList } from "./MessageList";
import { TaskForm } from "./TaskForm";
import { selectIsLoadingMessage, selectIsLoadingMessages, selectIsTyping } from "@store/selectors/chatSelectors";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { cancelAiTyping, Message, sendUserMessage } from "@store/slices/chatSlice";
import { LoadingIndicator } from "./LoadingIndicator";
import { useChatScroll } from "./hooks/useChatScroll";
import { Loading } from "@components/Loading";
import { Button } from "@ui/button";
import { ArrowDown } from "lucide-react";

type ChatCardProps = {
  projectId: string;
  messages: Message[];
  restartSSE: () => void;
};

export function ChatCard({ projectId, messages, restartSSE }: ChatCardProps) {
  const dispatch = useAppDispatch();
  const isLoadingMessages = useAppSelector(selectIsLoadingMessages);
  const isLoadingMessage = useAppSelector(selectIsLoadingMessage);
  const isTyping = useAppSelector(selectIsTyping);

  const { scrollRef, isScrolledUp, scrollToBottom } = useChatScroll(messages, projectId);

  const handleSendMessage = (text: string) => {
    const value = text.trim();
    if (!value) return;

    dispatch(sendUserMessage({
      projectId,
      role: "user",
      message: value,
    }))
  };

  const handleCancelAiTyping = () => {
    dispatch(cancelAiTyping(projectId));
    restartSSE();
  }

  const handleCancelAiTypingWhileUserSendMessage = (userMessage: string) => {
    dispatch(cancelAiTyping(projectId));
    handleSendMessage(userMessage)
    restartSSE();
  }

  const ScrollToBottomButton = () => (
    <Button
      onClick={scrollToBottom}
      variant="ghost"
      className="
        absolute 
        bottom-28
        left-1/2  
        z-50
        rounded-full
        border-border
        border
      "
    >
      <ArrowDown />
    </Button>
  )

  return (
    <div
      style={{
        height: "calc(100vh - 20px - 72px)",
        display: "grid",
        gridTemplateRows: "1fr auto",
      }}
    >
      <div
        ref={scrollRef}
        className="overflow-y-auto"
      >
        {isLoadingMessages ? (
          <Loading />
        ) : (
          <>
            <MessageList messages={messages} projectId={projectId} />
            <div className="flex h-[26px]">{isLoadingMessage && <LoadingIndicator />}</div>
          </>
        )}

        {isScrolledUp && <ScrollToBottomButton />}

      </div>
      <TaskForm
        isTyping={isTyping}
        sendMessage={handleSendMessage}
        cancelAiTyping={handleCancelAiTyping}
        cancelAiTypingWhileUserSendMessage={handleCancelAiTypingWhileUserSendMessage}
      />
    </div>
  );
}
