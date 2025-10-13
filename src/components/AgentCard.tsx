import { Bot, CheckCircle2, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface AgentCardProps {
  name: string;
  role: string;
  status: "idle" | "working" | "completed";
  currentTask?: string;
}

export function AgentCard({ name, role, status, currentTask }: AgentCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "working":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default:
        return <Bot className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "working":
        return "Работает";
      case "completed":
        return "Выполнено";
      default:
        return "Ожидает";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "working":
        return "bg-blue-500/10 text-blue-700";
      case "completed":
        return "bg-green-500/10 text-green-700";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <Card className="p-5 hover:shadow-md transition-shadow border border-border">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm text-foreground">{name}</h3>
            {getStatusIcon()}
          </div>
          <p className="text-xs text-muted-foreground mb-3">{role}</p>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className={`text-xs ${getStatusColor()}`}>
              {getStatusLabel()}
            </Badge>
          </div>
          {currentTask && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {currentTask}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
