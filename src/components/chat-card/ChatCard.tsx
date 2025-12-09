import { MessageList } from "./MessageList";
import { TaskForm } from "./TaskForm";
import { selectIsLoadingMessage, selectIsLoadingMessages, selectIsTyping } from "@store/selectors/chatSelectors";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { cancelAiTyping, Message, sendUserMessage } from "@store/slices/chatSlice";
import { LoadingIndicator } from "./LoadingIndicator";
import { useChatScroll } from "./hooks/useChatScroll";
import { Loading } from "@components/Loading";

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

  const { scrollRef } = useChatScroll(messages, projectId);

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
