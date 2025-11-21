import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogBody } from "@ui/dialog";
import { Button } from "@ui/button";
import { Textarea } from "@ui/textarea";
import { selectDialogOpen, closeDialog } from "../../store/slices/uiSlice";
import { addMessage, Message, sendSSEMessage } from "@store/slices/chatSlice";
import { useAppDispatch } from "@store/hooks";

interface PromptDialogProps {
  promptProp: string;
  type: string;
  projectId: string;
}

export function PromptDialog({ promptProp, type, projectId }: PromptDialogProps) {
  const dispatch = useAppDispatch();
  const open = useSelector(selectDialogOpen(type));

  const [prompt, setPrompt] = useState(promptProp);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset
  } = useForm({
    defaultValues: { prompt: promptProp },
  });

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setPrompt(promptProp);
        setError(null);
        reset();
      }, 300);
    }
  }, [open, reset]);

  const validatePrompt = (value: string): boolean => {
    if (!value.trim()) {
      setError("Промпт не может быть пустым");
      return false;
    }
    if (value.length < 10) {
      setError("Слишком коротко — минимум 10 символов");
      return false;
    }
    setError(null);
    return true;
  };

  const onSubmit = async () => {
    if (!validatePrompt(prompt)) return;

    const message: Message = { projectId, role: "user", message: `Промпт получен: ${prompt}` }

    dispatch(addMessage(message));
    dispatch(sendSSEMessage(message));
    dispatch(closeDialog(type));
  };

  return (
    <Dialog open={open} onOpenChange={(v: any) => !v && dispatch(closeDialog(type))}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Опишите задачу — AI сгенерирует код, структуру и документацию</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-2">
            <Textarea
              {...register("prompt")}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (error) validatePrompt(e.target.value);
              }}
              placeholder="Опишите проект..."
              className="h-[60vh] font-mono text-sm"
              id="prompt"
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        </DialogBody>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch(closeDialog(type))}
          >
            Отмена
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>
            Создать проект
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}