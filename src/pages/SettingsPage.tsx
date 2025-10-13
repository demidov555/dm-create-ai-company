import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setTheme, clearNotifications } from "../store/slices/uiSlice";

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const notifications = useAppSelector((state) => state.ui.notifications);

  const handleThemeToggle = () => {
    dispatch(setTheme(theme === "light" ? "dark" : "light"));
    // Apply theme to document
    if (theme === "light") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl mb-2 text-foreground">Настройки</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Управление настройками приложения
        </p>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card className="p-6 border border-border">
            <h2 className="text-xl mb-4 text-foreground">Внешний вид</h2>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="theme-toggle">Тёмная тема</Label>
                <p className="text-sm text-muted-foreground">
                  Переключить между светлой и тёмной темой
                </p>
              </div>
              <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={handleThemeToggle}
              />
            </div>
          </Card>

          {/* Notifications Settings */}
          <Card className="p-6 border border-border">
            <h2 className="text-xl mb-4 text-foreground">Уведомления</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Активные уведомления</Label>
                  <p className="text-sm text-muted-foreground">
                    Количество: {notifications.length}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => dispatch(clearNotifications())}
                  disabled={notifications.length === 0}
                >
                  Очистить все
                </Button>
              </div>
            </div>
          </Card>

          {/* Account Settings */}
          <Card className="p-6 border border-border">
            <h2 className="text-xl mb-4 text-foreground">Аккаунт</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-foreground mb-2 block">
                  Email
                </Label>
                <input
                  type="email"
                  value="user@example.com"
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground"
                  readOnly
                />
              </div>
              <div className="pt-4">
                <Button variant="destructive">Удалить аккаунт</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
