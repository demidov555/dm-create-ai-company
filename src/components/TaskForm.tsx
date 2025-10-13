import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";

interface TaskFormProps {
  onSubmit: (task: string) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [task, setTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      onSubmit(task);
      setTask("");
    }
  };

  return (
    <Card className="p-6 border border-border">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-sm text-foreground mb-2 block">
            Задача для продукт-менеджера
          </label>
          <Textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Опишите задачу или цель проекта. Продукт-менеджер распределит работу между агентами..."
            className="min-h-[120px] resize-none bg-input-background border-border focus:border-primary"
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!task.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="h-4 w-4 mr-2" />
            Отправить задачу
          </Button>
        </div>
      </form>
    </Card>
  );
}
