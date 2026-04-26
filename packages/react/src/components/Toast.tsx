import { useState, useEffect, useRef, type ReactNode } from "react";

export interface ToastProps {
  type?: "alert" | "notification" | "warning";
  message?: ReactNode;
  onClose?: () => void;
}

export function Toast({ type = "notification", message, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const prevMessageRef = useRef(message);

  useEffect(() => {
    if (message !== prevMessageRef.current) {
      prevMessageRef.current = message;
      setVisible(true);
    }
  }, [message]);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div className={`toast toast-${type}`}>
      <button className="toast-btn--close" onClick={handleClose} aria-label="close">
        &times;
      </button>
      {message}
    </div>
  );
}
