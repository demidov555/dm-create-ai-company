import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export function TaskForm({ onSendMessage }: any) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim()) {
      onSendMessage(message);
      setMessage('')
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Опишите задачу или цель проекта"
          className="resize-none bg-input-background border-border focus:border-primary"
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!message.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Send className="h-4 w-4 mr-2" />
          Отправить задачу
        </Button>
      </div>
    </form>
  );
}
