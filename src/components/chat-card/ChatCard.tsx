import { MessageList } from "./MessageList";
import { TaskForm } from "./TaskForm";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectIsLoading, selectMessages } from "@store/selectors/chatSelectors";
import { addMessage, Message, sendMessage } from "../../store/slices/chatSlice";
import { useChatSSE } from "./hooks/useChatSSE";
import TypingIndicator from "./TypingIndicator";
import { useChatScroll } from "./hooks/useChatScroll";

type ChatCardProps = {
  projectId: string;
  userId: number;
};

export default function ChatCard({ projectId, userId }: ChatCardProps) {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const isLoading = useAppSelector(selectIsLoading);

  useChatSSE({ projectId, userId });

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

    dispatch(addMessage(userMsg));
    dispatch(sendMessage(userMsg));
  };

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

        {isLoading && (
          <div className="px-4 py-2 flex">
            <TypingIndicator />
          </div>
        )}
      </div>


      <TaskForm onSendMessage={handleSendMessage} />
    </div>

  );
}
