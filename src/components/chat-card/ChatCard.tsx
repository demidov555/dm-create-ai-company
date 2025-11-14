import { MessageList } from "./MessageList";
import { TaskForm } from "./TaskForm";
import { selectIsLoading, selectIsTyping, selectMessages } from "@store/selectors/chatSelectors";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { cancelAiTyping, Message, sendUserMessage } from "@store/slices/chatSlice";
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
  const isLoading = useAppSelector(selectIsLoading);
  const isTyping = useAppSelector(selectIsTyping);

  const { restart } = useChatSSE({ projectId, userId });
  const { scrollRef } = useChatScroll(messages);

  const handleSendMessage = (text: string) => {
    const value = text.trim();
    if (!value) return;

    const userMsg: Message = {
      projectId,
      userId,
      role: "user",
      message: value,
    };

    // setTimeout(() => dispatch(sendUserMessage(userMsg)), 200)
    dispatch(sendUserMessage(userMsg))
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
        <MessageList messages={messages} />
        {isLoading && (<div className="px-4 py-2 flex"><LoadingIndicator /></div>)}
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
