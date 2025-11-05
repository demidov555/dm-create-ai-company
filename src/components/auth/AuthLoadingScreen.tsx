import { Sparkles } from "lucide-react";

export function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 animate-pulse">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-sm text-primary">Фабрика проектов под ключ</span>
        </div>
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    </div>
  );
}
