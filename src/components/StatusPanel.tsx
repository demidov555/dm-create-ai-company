import { AlertCircle, CheckCircle2, Clock, Rocket } from "lucide-react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface StatusPanelProps {
  status: "idle" | "in-progress" | "ready" | "deployed";
  progress: number;
  lastUpdate?: string;
  onDeploy?: () => void;
  onEdit?: () => void;
}

export function StatusPanel({
  status,
  progress,
  lastUpdate,
  onDeploy,
  onEdit,
}: StatusPanelProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "ready":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "deployed":
        return <Rocket className="h-5 w-5 text-purple-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "ready":
        return "Проект готов к деплою";
      case "in-progress":
        return "Команда работает над проектом";
      case "deployed":
        return "Проект развернут";
      default:
        return "Ожидание задач";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "ready":
        return "bg-green-500/10 text-green-700";
      case "in-progress":
        return "bg-blue-500/10 text-blue-700";
      case "deployed":
        return "bg-purple-500/10 text-purple-700";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <Card className="p-6 border border-border bg-card">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-sm text-foreground mb-1">{getStatusText()}</h3>
            {lastUpdate && (
              <p className="text-xs text-muted-foreground">
                Обновлено: {lastUpdate}
              </p>
            )}
          </div>
        </div>
        <Badge variant="secondary" className={getStatusColor()}>
          {progress}%
        </Badge>
      </div>

      <div className="mb-6">
        <Progress value={progress} className="h-2" />
      </div>

      {status === "ready" && (
        <div className="flex gap-3">
          <Button
            onClick={onEdit}
            variant="outline"
            className="flex-1 border-border"
          >
            Изменить
          </Button>
          <Button
            onClick={onDeploy}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Деплой сайта
          </Button>
        </div>
      )}

      {status === "deployed" && (
        <Button
          variant="outline"
          className="w-full border-border"
          onClick={() => window.open("https://your-project.vercel.app", "_blank")}
        >
          Открыть сайт
        </Button>
      )}
    </Card>
  );
}
