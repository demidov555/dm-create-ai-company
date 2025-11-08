import { Rocket, Edit, TrendingUp } from "lucide-react";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { Progress } from "@ui/progress";
import { Badge } from "@ui/badge";

interface StatusPanelProps {
  onEdit: () => void;
  status: string;
  lastUpdated: string;
}

export function StatusPanel({ onEdit, status, lastUpdated }: StatusPanelProps) {
  const progress = status === "completed" ? 100 : status === "in-progress" ? 15 : 20;

  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700 hover:bg-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 hover:bg-gray-500/20";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "completed":
        return "Готов";
      case "in-progress":
        return "В работе";
      default:
        return "Активен";
    }
  };

  return (
    <Card className="p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className={getStatusColor()}>
              {getStatusLabel()}
            </Badge>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-sm text-foreground mb-1">
            Прогресс проекта: {progress}%
          </h3>
          <p className="text-sm text-muted-foreground">
            Обновлено: {lastUpdated}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl text-foreground">{progress}%</p>
        </div>
      </div>

      <div className="mb-6">
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onEdit}
          variant="outline"
          className="flex-1 border-border"
        >
          <Edit className="h-4 w-4 mr-2" />
          Изменить
        </Button>
        <div className="flex gap-2">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={status === "completed"}
          >
            <Rocket className="h-4 w-4 mr-2" />
            {status === "completed" ? "Развернут" : "Деплой"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
