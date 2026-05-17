import {
  useRef,
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import "./Dialog.css";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DialogAction {
  label: string;
  variant?: "primary" | "ghost" | "help";
  onClick: () => void;
}

export interface DialogProps {
  title?: string;
  isOpen: boolean;
  onClose?: () => void;
  actions?: DialogAction[];
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
  closeOnBackdrop?: boolean;
  className?: string;
}

export interface DialogAPI {
  alert: (message: string, opts?: { title?: string; ok?: string }) => Promise<void>;
  confirm: (message: string, opts?: { title?: string; ok?: string; cancel?: string }) => Promise<boolean>;
  prompt: (message: string, opts?: { title?: string; ok?: string; cancel?: string; defaultValue?: string; placeholder?: string }) => Promise<string | null>;
}

// ── Controlled Dialog ─────────────────────────────────────────────────────────

export function Dialog({
  title = "Dialog",
  isOpen,
  onClose,
  actions,
  children,
  size = "sm",
  closeOnBackdrop = true,
  className,
}: DialogProps) {
  const [rendered, setRendered] = useState(isOpen);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      setClosing(false);
    } else if (rendered) {
      setClosing(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!rendered) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rendered, onClose]);

  if (!rendered) return null;

  return createPortal(
    <div
      className="dd-dialog-backdrop"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={["dd-dialog", closing ? "dd-dialog--closing" : "", size !== "sm" ? `dd-dialog--${size}` : "", className].filter(Boolean).join(" ")}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={() => { if (closing) setRendered(false); }}
      >
        <div className="dd-win">
          <div className="dd-win-header dd-win-header--no-move">
            <div className="dd-win-title-group">
              <span className="dd-win-title">{title}</span>
            </div>
            <div className="dd-win-controls">
              <button className="dd-btn--close" aria-label="close" onClick={onClose} />
            </div>
          </div>
          <div className="dd-win-body">{children}</div>
          {actions && actions.length > 0 && (
            <div className="dd-dialog-actions">
              {actions.map((a, i) => (
                <Button key={i} variant={a.variant ?? "ghost"} onClick={a.onClick}>
                  {a.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Imperative API ────────────────────────────────────────────────────────────

const DialogContext = createContext<DialogAPI | null>(null);

export function useDialog(): DialogAPI {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used inside <DialogProvider>");
  return ctx;
}

type PendingState =
  | { type: "alert"; title: string; message: string; resolve: () => void }
  | { type: "confirm"; title: string; message: string; ok: string; cancel: string; resolve: (v: boolean) => void }
  | { type: "prompt"; title: string; message: string; ok: string; cancel: string; placeholder: string; defaultValue: string; resolve: (v: string | null) => void };

export function DialogProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingState | null>(null);
  const [promptValue, setPromptValue] = useState("");
  // Keep last pending alive so content stays visible during the close animation
  const lastPendingRef = useRef<PendingState | null>(null);
  if (pending) lastPendingRef.current = pending;
  const displayPending = pending ?? lastPendingRef.current;

  const dismiss = useCallback((value: any) => {
    (pending?.resolve as ((v: any) => void) | undefined)?.(value);
    setPending(null);
  }, [pending]);

  const api: DialogAPI = {
    alert: (message, opts = {}) =>
      new Promise<void>((resolve) =>
        setPending({ type: "alert", message, title: opts.title ?? "Alert", resolve })
      ),
    confirm: (message, opts = {}) =>
      new Promise<boolean>((resolve) =>
        setPending({ type: "confirm", message, title: opts.title ?? "Confirm", ok: opts.ok ?? "OK", cancel: opts.cancel ?? "Cancel", resolve })
      ),
    prompt: (message, opts = {}) => {
      setPromptValue(opts.defaultValue ?? "");
      return new Promise<string | null>((resolve) =>
        setPending({ type: "prompt", message, title: opts.title ?? "Input", ok: opts.ok ?? "OK", cancel: opts.cancel ?? "Cancel", placeholder: opts.placeholder ?? "", defaultValue: opts.defaultValue ?? "", resolve })
      );
    },
  };

  const actions: DialogAction[] = [];
  if (displayPending?.type === "alert") {
    actions.push({ label: "OK", variant: "primary", onClick: () => dismiss(undefined) });
  } else if (displayPending?.type === "confirm") {
    actions.push({ label: displayPending.cancel, variant: "ghost", onClick: () => dismiss(false) });
    actions.push({ label: displayPending.ok, variant: "primary", onClick: () => dismiss(true) });
  } else if (displayPending?.type === "prompt") {
    actions.push({ label: displayPending.cancel, variant: "ghost", onClick: () => dismiss(null) });
    actions.push({ label: displayPending.ok, variant: "primary", onClick: () => dismiss(promptValue) });
  }

  const handlePromptKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") dismiss(promptValue);
  };

  return (
    <DialogContext.Provider value={api}>
      {children}
      <Dialog
        title={displayPending?.title}
        isOpen={!!pending}
        onClose={() => {
          if (pending?.type === "confirm") dismiss(false);
          else if (pending?.type === "prompt") dismiss(null);
          else dismiss(undefined);
        }}
        actions={actions}
        closeOnBackdrop={false}
      >
        {displayPending && (
          <>
            <p className="dd-dialog-message">{displayPending.message}</p>
            {displayPending.type === "prompt" && (
              <div style={{ padding: "0 0.5rem 0.25rem" }}>
                <input
                  className="dreamdesk-input dd-dialog-prompt-input"
                  type="text"
                  value={promptValue}
                  placeholder={displayPending.placeholder}
                  autoFocus
                  onChange={(e) => setPromptValue(e.target.value)}
                  onKeyDown={handlePromptKey}
                />
              </div>
            )}
          </>
        )}
      </Dialog>
    </DialogContext.Provider>
  );
}
