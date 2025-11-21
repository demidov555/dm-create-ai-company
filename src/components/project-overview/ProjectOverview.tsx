import { Card } from "@ui/card";
import { StatusPanel } from "./StatusPanel";
import { Code2, FileText, TrendingUp } from "lucide-react";
import { ProjectDetailsInfo } from "@store/slices/projectDetailsSlice";

type ProjectOverviewProps = {
  project: ProjectDetailsInfo;
};

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <>
      <Card className="mb-4">
        <h1 className="text-3xl text-foreground mb-2">{project.name}</h1>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {project.description}
        </p>
      </Card>

      <div className="mb-4">
        <StatusPanel
          percent={project.metrica.progress.percent}
          status={project.status}
          lastUpdated={project.metrica.progress.lastUpdate}
          onEdit={() => alert("Режим редактирования")}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Code2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl text-foreground">{project.metrica.codeStringCoutner}</p>
              <p className="text-xs text-muted-foreground">Строк кода</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl text-foreground">{project.metrica.componentCounter}</p>
              <p className="text-xs text-muted-foreground">Компонентов</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl text-foreground">{project.metrica.testOverageCouter}%</p>
              <p className="text-xs text-muted-foreground">Покрытие тестами</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
