import { useState, type ReactNode } from "react";

export interface ToastProps {
  type?: "alert" | "notification" | "warning";
  message?: ReactNode;
  onClose?: () => void;
}

export function Toast({ type = "notification", message, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-btn--close" onClick={handleClose} role="button" aria-label="close">
        &times;
      </span>
      {message}
    </div>
  );
}
