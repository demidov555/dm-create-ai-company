import { Card } from "@ui/card";
import { Badge } from "@ui/badge";
import {
  AgentStatusEnum,
  AgentTaskEnum,
  AgentTaskRU,
} from "@store/slices/projectStatusSlice";
import { Bot, CheckCircle2, Loader2 } from "lucide-react";

type StatusConfig = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className: string;
  spin?: boolean;
};

const STATUS_CONFIG: Record<AgentStatusEnum, StatusConfig> = {
  [AgentStatusEnum.IDLE]: {
    label: "Ожидает",
    icon: Bot,
    className: "bg-gray-500/10 text-gray-600",
  },
  [AgentStatusEnum.WORKING]: {
    label: "Работает",
    icon: Loader2,
    className: "bg-blue-500/10 text-blue-700",
    spin: true,
  },
  [AgentStatusEnum.WAITING]: {
    label: "Ждёт",
    icon: Bot,
    className: "bg-gray-500/10 text-gray-600",
  },
  [AgentStatusEnum.COMPLETED]: {
    label: "Выполнено",
    icon: CheckCircle2,
    className: "bg-green-500/10 text-green-700",
  },
  [AgentStatusEnum.ERROR]: {
    label: "Ошибка",
    icon: Bot,
    className: "bg-red-500/10 text-red-700",
  },
};

export const HIDDEN_TASKS = new Set<AgentTaskEnum>([]);

interface AgentCardProps {
  agentId: string;
  name: string;
  role: string;
  status?: AgentStatusEnum;
  currentTask?: AgentTaskEnum | null;
}

export function AgentCard({ agentId, name, role, status, currentTask }: AgentCardProps) {
  const fallbackConfig = STATUS_CONFIG[AgentStatusEnum.IDLE];
  const cfg: StatusConfig =
    (status && STATUS_CONFIG[status]) || fallbackConfig;

  const Icon = cfg.icon;

  const visibleTask =
    currentTask &&
      !HIDDEN_TASKS.has(currentTask) &&
      AgentTaskRU[currentTask]
      ? AgentTaskRU[currentTask]
      : null;

  return (
    <Card className="p-5 hover:shadow-md transition-shadow border border-border">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Bot className="h-6 w-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm text-foreground">{name}</h3>
            <Icon
              className={`h-4 w-4 ${cfg.className} ${cfg.spin ? "animate-spin" : ""
                }`}
            />
          </div>

          <p className="text-xs text-muted-foreground mb-3">{role}</p>

          {agentId !== 'ProductManager' && (
            <Badge variant="secondary" className={`text-xs ${cfg.className}`}>
              {cfg.label}
            </Badge>
          )}


          {visibleTask && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {visibleTask}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
