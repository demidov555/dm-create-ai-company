import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AppSidebar } from "./components/AppSidebar";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { SettingsPage } from "./pages/SettingsPage";
import { CreateProjectDialog } from "./components/CreateProjectDialog";
import { Toaster } from "./components/ui/sonner";
import { LoginPage } from "./pages/LoginPage";

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

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
        <CreateProjectDialog />
      </BrowserRouter>
      <Toaster theme="system" richColors expand />
    </Provider>
  );
}
