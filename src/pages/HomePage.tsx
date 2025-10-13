import { ArrowRight, Sparkles, Zap, Users, Rocket, FolderOpen, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAppSelector } from "../store/hooks";
import { selectProjectsCount, selectActiveProjectsCount } from "../store/selectors/projectSelectors";
import { selectWorkingAgentsCount } from "../store/selectors/agentSelectors";

export function HomePage() {
  const navigate = useNavigate();
  const projectsCount = useAppSelector(selectProjectsCount);
  const activeProjectsCount = useAppSelector(selectActiveProjectsCount);
  const workingAgentsCount = useAppSelector(selectWorkingAgentsCount);
  const features = [
    {
      icon: Users,
      title: "Команда AI агентов",
      description: "Продукт-менеджер, дизайнер, разработчики и QA работают вместе",
    },
    {
      icon: Zap,
      title: "Автоматизация",
      description: "От идеи до готового проекта с кодом и тестами",
    },
    {
      icon: Rocket,
      title: "Мгновенный деплой",
      description: "Развертывание сайта одним кликом",
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">Фабрика проектов под ключ</span>
            </div>
            
            <h1 className="text-5xl mb-6 text-foreground">
              Создавайте веб-приложения<br />с помощью AI агентов
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Опишите свою идею, и команда AI агентов создаст для вас полноценный проект: 
              от дизайна до развернутого сайта с кодом, тестами и маркетинговым планом
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/projects")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8"
              >
                Начать создание проекта
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-8 py-20 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl text-center mb-4 text-foreground">
              Как это работает
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Наша платформа использует команду специализированных AI агентов для создания проектов
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-8 border border-border hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {projectsCount > 0 && (
          <div className="px-8 py-20 bg-secondary/30">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl text-center mb-12 text-foreground">
                Ваша активность
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-8 border border-border text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl mb-2 text-foreground">{projectsCount}</p>
                  <p className="text-sm text-muted-foreground">Всего проектов</p>
                </Card>
                <Card className="p-8 border border-border text-center">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-3xl mb-2 text-foreground">{activeProjectsCount}</p>
                  <p className="text-sm text-muted-foreground">Активных проектов</p>
                </Card>
                <Card className="p-8 border border-border text-center">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-3xl mb-2 text-foreground">{workingAgentsCount}</p>
                  <p className="text-sm text-muted-foreground">Агентов работают</p>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl mb-4 text-foreground">
              Готовы начать?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {projectsCount > 0 
                ? "Создайте новый проект или продолжите работу над существующими"
                : "Создайте свой первый проект прямо сейчас"}
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/projects")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8"
            >
              Перейти к проектам
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
