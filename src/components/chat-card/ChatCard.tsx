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
  const { scrollRef, reserveSpace } = useChatScroll(messages);

  const handleSendMessage = (text: string) => {
    const value = text.trim();
    if (!value) return;
    const userMsg: Message = { projectId, userId, role: "user", message: value };
    dispatch(addMessage(userMsg));
    dispatch(sendMessage(userMsg));
  };

  return (
    (<div className="flex flex-col h-full" style={{ height: "calc(100vh - 20px - 72px)" }}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
        <MessageList messages={messages} />
        {reserveSpace > 0 && (<div style={{ height: reserveSpace }}>{isLoading && <div className="flex"><TypingIndicator /></div>}</div>)}
      </div>
      <TaskForm onSendMessage={handleSendMessage} />
    </div>
    )
  );
}