import { useSocket } from "../../hooks/useSocket";
import { sendMessage } from "../../store/slices/chatSlice";
import { MessageList } from "./MessageList";
import { TaskForm } from "./TaskForm";
import { Card } from "../ui/card";
import { VITE_API_URL } from "../../../configs";
import { useAppDispatch } from "../../store/hooks";

type ChatCardProps = {
  projectId: string;
  userId: number;
  role: "user" | "agent";
  messages?: any
};

export default function ChatCard({ messages, projectId, userId, role }: ChatCardProps) {
  useSocket(VITE_API_URL);
  const dispatch = useAppDispatch();

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    dispatch(sendMessage({
      projectId,
      userId,
      role,
      message: text.trim(),
    }));
  };

  return (
    <Card className="p-4 border border-border">
      <MessageList messages={messages} />
      <TaskForm onSendMessage={handleSendMessage} />
    </Card>
  );
}
