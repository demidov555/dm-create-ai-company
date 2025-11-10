"use client";

import * as React from "react";
import {
  AlertDialog,
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

interface WarningDialogProps {
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

export const WarningDialog = React.forwardRef<HTMLDivElement, WarningDialogProps>(
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
      type === "warning" && "bg-destructive/10 text-destructive dark:bg-destructive/20",
      type === "error" && "bg-red-500/10 text-red-500 dark:bg-red-500/20",
      type === "info" && "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
      type === "success" && "bg-green-500/10 text-green-500 dark:bg-green-500/20"
    );

    const confirmButtonClass = cn(
      "transition-colors",
      type === "warning" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      type === "error" && "bg-red-600 text-white hover:bg-red-700",
      type === "success" && "bg-green-600 text-white hover:bg-green-700",
      type === "info" && "bg-blue-600 text-white hover:bg-blue-700"
    );

    const handleConfirm = () => {
      onConfirm();
      onOpenChange(false);
    };

    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent ref={ref} className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className={iconBgClasses}>
                {Icon}
              </div>
              <AlertDialogTitle>{title}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="mt-2">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>{cancelText}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className={confirmButtonClass}>
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);

WarningDialog.displayName = "WarningDialog";