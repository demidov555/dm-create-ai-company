import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from "@ui/dialog";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { Label } from "@ui/label";
import { ProjectSettingsInfo } from "@store/slices/projectDetailsSlice";

interface ProjectSettingsCardProps {
  settingsInfo: ProjectSettingsInfo;
  onUpdate?: (updated: ProjectSettingsInfo) => void;
  onDelete?: () => void;
}

export function ProjectSettingsCard({
  settingsInfo,
  onUpdate,
  onDelete,
}: ProjectSettingsCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [edited, setEdited] = useState(settingsInfo);

  const handleSave = () => {
    onUpdate?.(edited);
    setIsEditOpen(false);
  };

  const handleCancel = () => {
    setEdited(settingsInfo);
    setIsEditOpen(false);
  };

  return (
    <>
      <Card className="p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Настройки проекта
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditOpen(true)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Редактировать</span>
          </Button>
        </div>

        <div className="space-y-5">
          <div>
            <Label className="text-sm text-muted-foreground">Название проекта</Label>
            <p className="mt-1 text-foreground font-medium">
              {settingsInfo.name}
            </p>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Описание проекта</Label>
            <p className="mt-1 text-foreground whitespace-pre-wrap">
              {settingsInfo.description || (
                <span className="text-muted-foreground italic">
                  Описание не указано
                </span>
              )}
            </p>
          </div>

          <div className="pt-4">
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить проект
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Редактировать проект</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название проекта</Label>
                <Input
                  id="name"
                  value={edited.name}
                  onChange={(e) => setEdited({ ...edited, name: e.target.value })}
                  className="col-span-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание проекта</Label>
                <Textarea
                  id="description"
                  value={edited.description}
                  onChange={(e) => setEdited({ ...edited, description: e.target.value })}
                  placeholder="Опишите проект..."
                  className="h-80 resize-none"
                />
              </div>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Отмена
            </Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}