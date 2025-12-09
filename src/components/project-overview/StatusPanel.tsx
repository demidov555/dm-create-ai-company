import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { Progress } from "@ui/progress";
import { Badge } from "@ui/badge";
import { formatShortDateTime } from "@utils/date";
import { Loader2, Rocket, AlertTriangle, CheckCircle } from "lucide-react";
import { ProjectStatusEnum } from "@store/slices/projectStatusSlice";

export type StatusConfig = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className: string;
  spin?: boolean;
};

export const STATUS_CONFIG: Record<ProjectStatusEnum, StatusConfig> = {
  [ProjectStatusEnum.IDLE]: {
    label: "Не запущен",
    icon: Rocket,
    className: "bg-gray-500/10 text-gray-700 hover:bg-gray-500/20",
  },

  [ProjectStatusEnum.IN_PROGRESS]: {
    label: "В процессе",
    icon: Rocket,
    className: "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20",
  },

  [ProjectStatusEnum.COMPLETED]: {
    label: "Завершён",
    icon: CheckCircle,
    className: "bg-green-500/10 text-green-700 hover:bg-green-500/20",
  },

  [ProjectStatusEnum.ERROR]: {
    label: "Ошибка",
    icon: AlertTriangle,
    className: "bg-red-500/10 text-red-700 hover:bg-red-500/20",
  },
};

interface StatusPanelProps {
  status: ProjectStatusEnum;
  lastUpdated: string;
  percent: number;
}

export function StatusPanel({ percent, status, lastUpdated }: StatusPanelProps) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  return (
    <Card className="p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className={cfg.className}>
              <div className="flex items-center gap-1">
                <Icon className={`h-4 w-4 ${cfg.spin ? "animate-spin" : ""}`} />
                {cfg.label}
              </div>
            </Badge>
          </div>

          <h3 className="text-sm text-foreground mb-1">
            Прогресс проекта:
          </h3>

          <p className="text-sm text-muted-foreground">
            Обновлено: {formatShortDateTime(lastUpdated)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl text-foreground">{percent}%</p>
        </div>
      </div>

      <div className="mb-6">
        <Progress value={percent} className="h-2" />
      </div>

      {/* <div className="flex gap-3">
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={status !== ProjectStatusEnum.COMPLETED}
        >
          <Icon className="h-4 w-4 mr-2" />
          Просмотр проекта
        </Button>
      </div> */}
    </Card>
  );
}
