import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { AgentCard } from "../components/AgentCard";
import { TaskForm } from "../components/TaskForm";
import { StatusPanel } from "../components/StatusPanel";
import { MessageList } from "../components/MessageList";
import { MaterialTabs } from "../components/MaterialTabs";
import { ArrowLeft, Code2, FileText, TrendingUp, LayoutDashboard, Users, CheckSquare, Settings } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAppSelector } from "../store/hooks";
import { selectProjectById } from "../store/selectors/projectSelectors";
import { selectAgents } from "../store/selectors/agentSelectors";
import { selectMessagesByProject } from "../store/selectors/agentSelectors";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const project = useAppSelector((state) => 
    id ? selectProjectById(id)(state) : null
  );
  const agents = useAppSelector(selectAgents);
  const messages = useAppSelector((state) => 
    id ? selectMessagesByProject(id)(state) : []
  );
  
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
  const [activeTab, setActiveTab] = useState("overview");
  
  const tabs = [
    { id: "overview", icon: LayoutDashboard, label: "Обзор" },
    { id: "team", icon: Users, label: "Команда" },
    { id: "tasks", icon: CheckSquare, label: "Задачи" },
    { id: "code", icon: Code2, label: "Код" },
    { id: "marketing", icon: TrendingUp, label: "Маркетинг" },
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
          <h1 className="text-3xl text-foreground mb-2">{project.name}</h1>
          <p className="text-sm text-muted-foreground">
            Управление проектом и командой AI агентов
          </p>
        </div>

        {/* Material Tabs */}
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
            {activeTab === "overview" && (
              <div className="space-y-8">
                <StatusPanel
                  onEdit={() => alert("Режим редактирования")}
                />

                <div>
                  <h2 className="text-lg text-foreground mb-4">Быстрый обзор</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <Code2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl text-foreground">1,247</p>
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
                          <p className="text-2xl text-foreground">12</p>
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
                          <p className="text-2xl text-foreground">95%</p>
                          <p className="text-xs text-muted-foreground">Покрытие тестами</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <MessageList messages={messages} />
              </div>
            )}

            {activeTab === "team" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg text-foreground mb-4">Команда агентов</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.map((agent) => (
                      <AgentCard key={agent.id} {...agent} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg text-foreground mb-4">Новая задача</h2>
                  <TaskForm />
                </div>

                <div>
                  <h2 className="text-lg text-foreground mb-4">
                    История коммуникаций
                  </h2>
                  <MessageList messages={messages} />
                </div>
              </div>
            )}

            {activeTab === "code" && (
              <div className="space-y-8">
                <Card className="p-8 border border-border">
                  <div className="text-center">
                    <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg mb-2 text-foreground">Код проекта</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Просмотр и редактирование исходного кода
                    </p>
                    <Tabs defaultValue="components" className="w-full">
                      <TabsList className="mb-4">
                        <TabsTrigger value="components">Компоненты</TabsTrigger>
                        <TabsTrigger value="pages">Страницы</TabsTrigger>
                        <TabsTrigger value="api">API</TabsTrigger>
                      </TabsList>
                      <TabsContent value="components" className="text-left">
                        <div className="bg-secondary/30 rounded-lg p-4 text-sm font-mono">
                          <p className="text-muted-foreground">// src/components/Header.tsx</p>
                          <p className="text-foreground mt-2">export function Header() {"{"}</p>
                          <p className="text-foreground ml-4">return &lt;header&gt;...&lt;/header&gt;</p>
                          <p className="text-foreground">{"}"}</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="pages" className="text-left">
                        <div className="bg-secondary/30 rounded-lg p-4 text-sm font-mono">
                          <p className="text-muted-foreground">// src/pages/Home.tsx</p>
                          <p className="text-foreground mt-2">export function Home() {"{"}</p>
                          <p className="text-foreground ml-4">return &lt;div&gt;...&lt;/div&gt;</p>
                          <p className="text-foreground">{"}"}</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="api" className="text-left">
                        <div className="bg-secondary/30 rounded-lg p-4 text-sm font-mono">
                          <p className="text-muted-foreground">// api/products.ts</p>
                          <p className="text-foreground mt-2">export async function getProducts() {"{"}</p>
                          <p className="text-foreground ml-4">// API logic</p>
                          <p className="text-foreground">{"}"}</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "marketing" && (
              <div className="space-y-8">
                <Card className="p-8 border border-border">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg mb-2 text-foreground">Маркетинговый план</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      AI маркетолог разрабатывает стратегию продвижения
                    </p>
                    <div className="text-left space-y-4">
                      <Card className="p-4 bg-secondary/30">
                        <h4 className="text-sm mb-2 text-foreground">Целевая аудитория</h4>
                        <p className="text-sm text-muted-foreground">
                          Молодые предприниматели 25-40 лет, интересующиеся e-commerce
                        </p>
                      </Card>
                      <Card className="p-4 bg-secondary/30">
                        <h4 className="text-sm mb-2 text-foreground">Каналы продвижения</h4>
                        <p className="text-sm text-muted-foreground">
                          SEO, контент-маркетинг, социальные сети, email-рассылки
                        </p>
                      </Card>
                      <Card className="p-4 bg-secondary/30">
                        <h4 className="text-sm mb-2 text-foreground">Ключевые метрики</h4>
                        <p className="text-sm text-muted-foreground">
                          Конверсия 3.5%, CAC $15, LTV $450
                        </p>
                      </Card>
                    </div>
                  </div>
                </Card>
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
                        value={project.name}
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