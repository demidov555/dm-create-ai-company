import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { AgentCard } from "../components/AgentCard";
import { StatusPanel } from "../components/StatusPanel";
import { MaterialTabs } from "../components/MaterialTabs";
import { ArrowLeft, Code2, FileText, TrendingUp, LayoutDashboard, Users, CheckSquare, Settings } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectProjectDetails } from "../store/selectors/projectDetailsSelectors";
import { fetchProjectDetails } from "../store/slices/projectDetailsSlice";
import ChatCard from "../components/chat-card/ChatCard"
import { selectMessages } from "../store/selectors/chatSelectors";
import { fetchHistoryMessages } from "../store/slices/chatSlice";

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
      dispatch(fetchProjectDetails(Number(id)));
      dispatch(fetchHistoryMessages(id));
    }
  }, [dispatch, id]);

  const sendMessage = () => {
    // useEffect(() => {
    //     dispatch(fetchProjectDetails(projectId));
    // }, [dispatch, projectId]);
  };

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
  const [activeTab, setActiveTab] = useState("tasks");

  const tabs = [
    { id: "tasks", icon: CheckSquare, label: "Задачи" },
    { id: "team", icon: Users, label: "Команда" },
    { id: "overview", icon: LayoutDashboard, label: "Обзор" },
    { id: "settings", icon: Settings, label: "Настройки" },
  ];

  const handleDeploy = () => {
    alert("🚀 Деплой запущен! Ваш сайт будет доступен через несколько минут.");
  };

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="max-w-7xl mx-auto p-8">
        {/* Back Button and Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/projects")}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к проектам
          </Button>
          <h1 className="text-3xl text-foreground mb-2">{project.projectInfo.name}</h1>
          <p className="text-sm text-muted-foreground">
            {project.projectInfo.description}
          </p>
        </div>

        <div className="mb-8 -mx-8">
          <MaterialTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Animated Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "tasks" && (
              <div>
                <ChatCard messages={messages} projectId="1" role="user" userId={101} />
              </div>
            )}

            {activeTab === "team" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg text-foreground mb-4">Команда агентов</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.agents.map((agent) => (
                      <AgentCard key={agent.agentId} name={agent.name} role={agent.role} status={agent.status} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "overview" && (
              <div className="space-y-8">
                <StatusPanel
                  onEdit={() => alert("Режим редактирования")}
                />

                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 border border-border">
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
                    <Card className="p-6 border border-border">
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
                    <Card className="p-6 border border-border">
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
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-8">
                <Card className="p-8 border border-border">
                  <h3 className="text-lg mb-6 text-foreground">Настройки проекта</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm text-foreground mb-2 block">
                        Название проекта
                      </label>
                      <input
                        type="text"
                        value={project.projectInfo.name}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-sm text-foreground mb-2 block">
                        Домен деплоя
                      </label>
                      <input
                        type="text"
                        value="your-project.vercel.app"
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground"
                        readOnly
                      />
                    </div>
                    <div className="pt-4">
                      <Button variant="destructive">Удалить проект</Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}