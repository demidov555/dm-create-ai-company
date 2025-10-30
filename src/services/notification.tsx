import { ExternalToast, toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { JSX } from "react";

export type NotificationType = "success" | "error" | "info" | "warning";

const icons: Record<NotificationType, () => JSX.Element> = {
  success: () => (
    <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
  ),
  error: () => <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />,
  info: () => <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
  warning: () => (
    <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
  ),
};

class NotificationService {
  private baseToast(
    type: NotificationType,
    message: string,
    options?: ExternalToast
  ) {
    toast.custom(
      () => (
        <div
          className={`flex items-start gap-3 rounded-2xl p-3 min-w-[260px] max-w-sm border shadow-sm
          bg-white dark:bg-neutral-900
          ${type === "success"
              ? "border-green-200 dark:border-green-700"
              : type === "error"
                ? "border-red-200 dark:border-red-700"
                : type === "warning"
                  ? "border-yellow-200 dark:border-yellow-700"
                  : "border-blue-200 dark:border-blue-700"
            }
          animate-in fade-in slide-in-from-top`}
        >
          <div className="mt-[2px]">{icons[type]()}</div>
          <div className="flex flex-col">
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {message}
            </p>
            {options?.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {options.description.toString()}
              </p>
            )}
          </div>
        </div>
      ),
      { ...options }
    );
  }

  success(message: string, options?: ExternalToast) {
    this.baseToast("success", message, options);
  }

  error(message: string, options?: ExternalToast) {
    this.baseToast("error", message, options);
  }

  info(message: string, options?: ExternalToast) {
    this.baseToast("info", message, options);
  }

  warning(message: string, options?: ExternalToast) {
    this.baseToast("warning", message, options);
  }

  show(type: NotificationType, message: string, options?: ExternalToast) {
    this.baseToast(type, message, options);
  }
}

export const notificationService = new NotificationService();
