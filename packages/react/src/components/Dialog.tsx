import {
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
  /** Shows one button per choice and resolves to its value, or null if the dialog is dismissed. */
  choose: <T extends string>(message: string, opts: { title?: string; choices: DialogChoice<T>[] }) => Promise<T | null>;
}

export interface DialogChoice<T extends string = string> {
  label: string;
  value: T;
  primary?: boolean;
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
  // Opening or closing: adjust while rendering, rather than in an effect after
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setRendered(true);
      setClosing(false);
    } else if (rendered) {
      setClosing(true);
    }
  }

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
  | { type: "prompt"; title: string; message: string; ok: string; cancel: string; placeholder: string; defaultValue: string; resolve: (v: string | null) => void }
  | { type: "choose"; title: string; message: string; choices: DialogChoice[]; resolve: (v: string | null) => void };

export function DialogProvider({ children }: { children: ReactNode }) {
  const [pending, setPendingState] = useState<PendingState | null>(null);
  const [promptValue, setPromptValue] = useState("");
  // Keep the last dialog so its content stays visible during the close animation
  const [lastPending, setLastPending] = useState<PendingState | null>(null);
  const setPending = (next: PendingState | null) => {
    setPendingState(next);
    if (next) setLastPending(next);
  };
  const displayPending = pending ?? lastPending;

  const dismiss = useCallback((value: unknown) => {
    (pending?.resolve as ((v: unknown) => void) | undefined)?.(value);
    setPendingState(null);
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
    choose: <T extends string>(message: string, opts: { title?: string; choices: DialogChoice<T>[] }) =>
      new Promise<T | null>((resolve) =>
        setPending({ type: "choose", message, title: opts.title ?? "Choose", choices: opts.choices, resolve: resolve as (v: string | null) => void })
      ),
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
  } else if (displayPending?.type === "choose") {
    for (const c of displayPending.choices) {
      actions.push({ label: c.label, variant: c.primary ? "primary" : "ghost", onClick: () => dismiss(c.value) });
    }
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
          else if (pending?.type === "prompt" || pending?.type === "choose") dismiss(null);
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
