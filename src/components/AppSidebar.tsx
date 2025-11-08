import { Home, FolderOpen, Settings, Sparkles } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/tooltip";

export function AppSidebar() {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: Home, label: "Главная" },
    { path: "/projects", icon: FolderOpen, label: "Проекты" },
    { path: "/settings", icon: Settings, label: "Настройки" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-16 h-screen bg-card border-r border-border flex flex-col items-center py-6">
      {/* Logo */}
      <div className="mb-8">
        <NavLink to="/" className="block">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <TooltipProvider>
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  className={`h-12 w-12 rounded-md inline-flex items-center justify-center transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </div>
  );
}