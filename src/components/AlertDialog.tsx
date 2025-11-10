"use client";

import * as React from "react";
import {
  AlertDialogContainer,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/alert-dialog";
import { AlertTriangle, XCircle, Info, CheckCircle } from "lucide-react";
import { cn } from "@ui/utils";

type AlertType = "warning" | "error" | "info" | "success";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: AlertType;
  title?: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

const iconMap: Record<AlertType, React.ReactNode> = {
  warning: <AlertTriangle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />,
};


export const AlertDialog = React.forwardRef<HTMLDivElement, AlertDialogProps>(
  (
    {
      open,
      onOpenChange,
      description,
      type = "warning",
      title = "Вы уверены?",
      confirmText = "Подтвердить",
      cancelText = "Отмена",
      onConfirm,
    },
    ref
  ) => {
    const Icon = iconMap[type];

    const iconBgClasses = cn(
      "flex h-10 w-10 items-center justify-center rounded-full",
      type === "warning" && "bg-warn text-destructive",
      type === "error" && "bg-red-500/10 text-red-500 dark:bg-red-500/20",
      type === "info" && "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
      type === "success" && "bg-green-500/10 text-green-500 dark:bg-green-500/20"
    );

    const handleConfirm = () => {
      onConfirm();
      onOpenChange(false);
    };

    return (
      <AlertDialogContainer open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent ref={ref} className="sm:max-w-md" onEscapeKeyDown={() => onOpenChange(false)}>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className={iconBgClasses}>
                {Icon}
              </div>
              <AlertDialogTitle><span className="text-foreground">{title}</span></AlertDialogTitle>
            </div>
            {description && <AlertDialogDescription className="mt-2">
              {typeof description === 'string' && <span className="text-foreground">{description}</span>}
              {typeof description !== 'string' && description}
            </AlertDialogDescription>}

          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>{cancelText}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} variant={type === 'error' ? 'destructive' : 'default'}>
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogContainer>
    );
  }
);

AlertDialog.displayName = "AlertDialog";