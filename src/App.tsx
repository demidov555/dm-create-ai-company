import { useState, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import {
  CreateProjectDialog,
  ProjectData,
} from "./components/CreateProjectDialog";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "active" | "completed" | "in-progress";
  agentCount: number;
  lastUpdated: string;
}

interface ProjectsContextType {
  projects: Project[];
  addProject: (data: ProjectData) => string;
  deleteProject: (id: string) => void;
  openCreateDialog: () => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within ProjectsProvider");
  }
  return context;
};

function AppLayout() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl mb-6 text-foreground">Настройки</h1>
        <p className="text-muted-foreground">Страница настроек в разработке</p>
      </div>
    </div>
  );
}

export default function App() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Интернет-магазин с корзиной, оплатой и админ-панелью",
      status: "in-progress",
      agentCount: 5,
      lastUpdated: "2 часа назад",
    },
    {
      id: "2",
      name: "Portfolio Website",
      description: "Портфолио для дизайнера с галереей работ",
      status: "completed",
      agentCount: 3,
      lastUpdated: "1 день назад",
    },
    {
      id: "3",
      name: "SaaS Dashboard",
      description: "Аналитическая панель для B2B сервиса",
      status: "active",
      agentCount: 6,
      lastUpdated: "30 минут назад",
    },
  ]);

  const addProject = (data: ProjectData): string => {
    const newProject: Project = {
      id: String(Date.now()),
      name: data.name,
      description: data.description,
      status: "active",
      agentCount: data.agents.length,
      lastUpdated: "только что",
    };
    setProjects([newProject, ...projects]);
    return newProject.id;
  };

  const deleteProject = (id: string) => {
    if (confirm("Вы уверены, что хотите удалить этот проект?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const openCreateDialog = () => {
    setShowCreateDialog(true);
  };

  return (
    <BrowserRouter>
      <ProjectsContext.Provider
        value={{ projects, addProject, deleteProject, openCreateDialog }}
      >
        <AppLayout />
        <CreateProjectDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreateProject={addProject}
        />
      </ProjectsContext.Provider>
    </BrowserRouter>
  );
}
