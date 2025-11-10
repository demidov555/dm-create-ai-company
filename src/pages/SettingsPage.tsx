import { Card } from "@ui/card";
import { Label } from "@ui/label";
import { Switch } from "@ui/switch";
import { Button } from "@ui/button";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setTheme } from "../store/slices/uiSlice";
import { selectPhoneNumber } from "../store/selectors/authSelectors";
import { logoutUser } from "../store/slices/authSlice";
import { WarningDialog } from "@components/WarningDialog";
import { useState } from "react";

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const deleteAccount = () => {
    console.log('user was deleted')
  };

  const openLogoutDialog = () => {
    setIsLogoutDialogOpen(true);
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <h1 className="text-3xl mb-2 text-foreground">Настройки</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Управление настройками приложения
          </p>

          <div className="space-y-6">
            {/* Appearance Settings */}
            <Card>
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
            <Card>
              <h2 className="text-xl mb-4 text-foreground">Аккаунт</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Номер телефона
                  </Label>
                  <p className="mt-1 text-foreground font-medium">
                    {phone}
                  </p>
                </div>
              </div>

              <div className="space-y-4 grid justify-end">
                <div className="flex gap-4 flex-col">
                  <Button onClick={openLogoutDialog}>Выйти из аккаунта</Button>
                  <Button onClick={openDeleteDialog} variant="destructive">Удалить аккаунт</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <WarningDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        title="Выйти из аккаунта?"
        onConfirm={logout}
        type="info"
      />

      <WarningDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Удалить аккаунт?"
        confirmText="Удалить"
        onConfirm={deleteAccount}
        type="error"
      />
    </>
  );
}
