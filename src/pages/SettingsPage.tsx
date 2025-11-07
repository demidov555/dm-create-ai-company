import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setTheme } from "../store/slices/uiSlice";
import { selectPhoneNumber } from "../store/selectors/authSelectors";
import { logoutUser } from "../store/slices/authSlice";

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const phone = useAppSelector(selectPhoneNumber);

  const handleThemeToggle = () => {
    dispatch(setTheme(theme === "light" ? "dark" : "light"));
    if (theme === "light") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const logout = () => {
    dispatch(logoutUser());
  }

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

          {/* Account Settings */}
          <Card className="p-6 border border-border">
            <h2 className="text-xl mb-4 text-foreground">Аккаунт</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-foreground mb-2 block">
                  Номер телефона
                </Label>
                <input
                  type="phone"
                  value={phone || ''}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                  readOnly
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="pt-1">
                <Button click={logout}>Выйти из аккаунта</Button>
              </div>
              <div className="pt-1">
                <Button variant="destructive">Удалить аккаунт</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
