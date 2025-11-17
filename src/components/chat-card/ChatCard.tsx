import { MessageList } from "./MessageList";
import { TaskForm } from "./TaskForm";
import { selectIsLoadingMessage, selectIsLoadingMessages, selectIsTyping, selectMessages } from "@store/selectors/chatSelectors";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { cancelAiTyping, sendUserMessage } from "@store/slices/chatSlice";
import { useChatSSE } from "./hooks/useChatSSE";
import { LoadingIndicator } from "./LoadingIndicator";
import { useChatScroll } from "./hooks/useChatScroll";

type ChatCardProps = {
  projectId: string;
  userId: number;
};

export function ChatCard({ projectId, userId }: ChatCardProps) {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const isLoadingMessages = useAppSelector(selectIsLoadingMessages);
  const isLoadingMessage = useAppSelector(selectIsLoadingMessage);
  const isTyping = useAppSelector(selectIsTyping);

  const { restart } = useChatSSE({ projectId, userId });
  const { scrollRef } = useChatScroll(messages);

  const handleSendMessage = (text: string) => {
    const value = text.trim();
    if (!value) return;

    dispatch(sendUserMessage({
      projectId,
      userId,
      role: "user",
      message: value,
    }))
  };

  const handleCancelAiTyping = () => {
    dispatch(cancelAiTyping(projectId));
    restart();
  }

  const handleCancelAiTypingWhileUserSendMessage = (userMessage: string) => {
    dispatch(cancelAiTyping(projectId));
    handleSendMessage(userMessage)
    restart();
  }

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
          <span>loading...</span>
        ) : (
          <>
            <MessageList messages={messages} projectId={projectId} userId={userId} />
            <div className="flex h-[26px]">{isLoadingMessage && <LoadingIndicator />}</div>
          </>
        )}
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
