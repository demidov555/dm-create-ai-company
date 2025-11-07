import { useChatSSE } from "../../hooks/useChatSSE";
import { sendMessage } from "../../store/slices/chatSlice";
import { MessageList } from "./MessageList";
import { TaskForm } from "./TaskForm";
import { Card } from "../ui/card";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectIsConnected, selectIsLoading } from "../../store/selectors/chatSelectors";

type ChatCardProps = {
  projectId: string;
  userId: number;
  role: "user" | "agent";
  messages?: any
};

export default function ChatCard({ messages, projectId, userId, role }: ChatCardProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const isConnected = useAppSelector(selectIsConnected);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    dispatch(sendMessage({
      projectId: Number(projectId),
      userId,
      role,
      message: text.trim(),
      isLoading: true
    }));
  };

  return (
    <Card>
      <MessageList messages={messages} isLoading={isLoading} />
      <TaskForm onSendMessage={handleSendMessage} />
    </Card>
  );
}
