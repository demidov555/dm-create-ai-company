import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AgentCard } from "../components/AgentCard";
import { StatusPanel } from "../components/StatusPanel";
import { Code2, FileText, TrendingUp } from "lucide-react";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectProjectDetails } from "../store/selectors/projectDetailsSelectors";
import { fetchProject } from "../store/slices/projectDetailsSlice";
import ChatCard from "../components/chat-card/ChatCard"
import { selectMessages } from "../store/selectors/chatSelectors";
import { fetchHistoryMessages } from "../store/slices/chatSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { ProjectSettings } from "@components/project-settings/ProjectSettings";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const project = useAppSelector((state) => {
    return id ? selectProjectDetails(state) : null;
  });
  const messages = useAppSelector(selectMessages);

  useEffect(() => {
    if (id) {
      dispatch(fetchProject(id));
      dispatch(fetchHistoryMessages(id));
    }
  }, [dispatch, id]);

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl mb-4 text-foreground">Проект не найден</h2>
          <Button onClick={() => navigate("/projects")}>
            Вернуться к проектам
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="max-w-5xl min-w-[660px] mx-auto p-3">

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="tasks">Задачи</TabsTrigger>
            <TabsTrigger value="team">Команда</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="mb-4">
              <h1 className="text-3xl text-foreground mb-2">{project.projectInfo.name}</h1>
              <p className="text-sm text-muted-foreground">
                {project.projectInfo.description}
              </p>
            </Card>

            <div className="mb-4">
              <StatusPanel
                status={project.projectInfo.status}
                lastUpdated={project.projectInfo.last_updated}
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
          </TabsContent>

          <TabsContent value="tasks">
            <ChatCard messages={messages} projectId="1" role="user" userId={101} />
          </TabsContent>

          <TabsContent value="team">
            <h2 className="text-lg text-foreground mb-4">Команда агентов</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.agents.map((agent) => (
                <AgentCard key={agent.agentId} name={agent.name} role={agent.role} status={agent.status} currentTask={agent.currentTask} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <ProjectSettings projectId={project.projectInfo.projectId} name={project.projectInfo.name} description={project.projectInfo.description} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}