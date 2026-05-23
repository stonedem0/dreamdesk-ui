import { useEffect, useState } from "react";
import { subscribeNotifications, dismiss, type NotificationItem } from "@dreamdesk/core";
import { Toast } from "./Toast";
import "./ToastContainer.css";

export type ToastPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export interface ToastContainerProps {
  position?: ToastPosition;
  maxStack?: number;
}

export function ToastContainer({ position = "bottom-right", maxStack = 5 }: ToastContainerProps) {
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => subscribeNotifications(setItems), []);

  const visible = items.slice(-maxStack);

  return (
    <div className={`dd-toast-container dd-toast-container--${position}`}>
      {visible.map((item) => (
        <Toast
          key={item.id}
          type={item.type}
          message={item.message}
          onClose={() => dismiss(item.id)}
        />
      ))}
    </div>
  );
}
