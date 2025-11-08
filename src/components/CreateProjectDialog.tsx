import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { useAppDispatch } from "../store/hooks";
import { addProject } from "../store/slices/projectsSlice";
import { closeDialog, selectDialogOpen } from "../store/slices/uiSlice";
import { useSelector } from "react-redux";

const availableAgents = [
  { id: "product-manager", name: "Продукт-менеджер", required: true },
  { id: "designer", name: "Дизайнер" },
  { id: "frontend-dev", name: "Frontend разработчик" },
  { id: "backend-dev", name: "Backend разработчик" },
  { id: "qa", name: "QA инженер" },
  { id: "marketer", name: "Маркетолог" },
];
const dialogName = "createProjectsDialog";

export function CreateProjectDialog() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const open = useSelector(selectDialogOpen(dialogName));

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([
    "product-manager",
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const action = await dispatch(
      addProject({
        name,
        description,
        agent_count: selectedAgents.length,
      })
    );

    if (addProject.fulfilled.match(action)) {
      const createdProjectId = action.payload;

      setName("");
      setDescription("");
      setSelectedAgents(["product-manager"]);
      dispatch(closeDialog(dialogName));

      navigate(`/projects/${createdProjectId}`);
    } else {
      console.error("Ошибка при создании проекта:", action.payload);
    }

  };

  const handleClose = () => {
    dispatch(closeDialog(dialogName));
  };

  const toggleAgent = (agentId: string) => {
    if (agentId === "product-manager") return; // Required agent
    setSelectedAgents((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать новый проект</DialogTitle>
          <DialogDescription>
            Опишите ваш проект и выберите команду AI агентов
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название проекта</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Мой веб-проект"
                className="bg-input-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Краткое описание целей проекта..."
                className="min-h-[80px] resize-none bg-input-background border-border"
              />
            </div>
            <div className="space-y-3">
              <Label>Команда агентов</Label>
              <div className="space-y-3 border border-border rounded-lg p-4 bg-secondary/30">
                {availableAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center gap-3">
                    <Checkbox
                      id={agent.id}
                      checked={selectedAgents.includes(agent.id)}
                      onCheckedChange={() => toggleAgent(agent.id)}
                      disabled={agent.required}
                    />
                    <label
                      htmlFor={agent.id}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <Bot className="h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground">
                        {agent.name}
                        {agent.required && (
                          <span className="text-xs text-muted-foreground ml-2">
                            (обязательно)
                          </span>
                        )}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={!name.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Создать проект
              </Button>
            </div>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
