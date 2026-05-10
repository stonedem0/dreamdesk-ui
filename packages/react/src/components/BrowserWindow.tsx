import { useState, type ReactNode } from "react";
import { Window, type WindowProps } from "./Window";
import "./BrowserWindow.css";

export interface BrowserWindowProps extends Omit<WindowProps, "children" | "scrollContent" | "bodyOverflow"> {
  url?: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onNavigate?: (url: string) => void;
  onBack?: () => void;
  onForward?: () => void;
  onStop?: () => void;
  onRefresh?: () => void;
  onHome?: () => void;
  children?: ReactNode;
}

interface ToolbarBtn {
  id: string;
  label?: string;
  icon?: string;
  arrow?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function BrowserWindow({
  url = "",
  canGoBack = false,
  canGoForward = false,
  onNavigate,
  onBack,
  onForward,
  onStop,
  onRefresh,
  onHome,
  children,
  className,
  ...windowProps
}: BrowserWindowProps) {
  const [addressValue, setAddressValue] = useState(url);

  const handleGo = () => {
    const target = addressValue.trim();
    if (target) onNavigate?.(target);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleGo();
  };

  const toolbarButtons: (ToolbarBtn | "sep")[] = [
    { id: "back",     label: "Back",     icon: "←", arrow: true, disabled: !canGoBack,    onClick: onBack },
    { id: "forward",  label: "Forward",  icon: "→", arrow: true, disabled: !canGoForward, onClick: onForward },
    "sep",
    { id: "stop",     label: "Stop",     icon: "✕",              onClick: onStop },
    { id: "refresh",  label: "Refresh",  icon: "↻",              onClick: onRefresh },
    { id: "home",     label: "Home",     icon: "⌂",              onClick: onHome },
    "sep",
    { id: "search",   label: "Search",   icon: "⚲" },
    { id: "favorites",label: "Favorites",icon: "★" },
    { id: "history",  label: "History",  icon: "⊞" },
  ];

  return (
    <Window
      {...windowProps}
      className={["dd-browser-window", className].filter(Boolean).join(" ")}
      bodyOverflow="hidden"
    >
      <div className="dd-browser">
        {/* Toolbar row */}
        <div className="dd-browser-toolbar">
          {toolbarButtons.map((btn, i) =>
            btn === "sep" ? (
              <div key={`sep-${i}`} className="dd-browser-sep" />
            ) : (
              <button
                key={btn.id}
                className={["dd-browser-btn", btn.disabled ? "dd-browser-btn--disabled" : ""].filter(Boolean).join(" ")}
                onClick={btn.disabled ? undefined : btn.onClick}
                tabIndex={btn.disabled ? -1 : undefined}
                aria-disabled={btn.disabled}
              >
                <span className="dd-browser-btn-icon">{btn.icon}</span>
                <span className="dd-browser-btn-label">
                  {btn.label}
                  {btn.arrow && <span className="dd-browser-btn-arrow"> ▾</span>}
                </span>
              </button>
            )
          )}
        </div>

        {/* Address bar row */}
        <div className="dd-browser-addressbar">
          <span className="dd-browser-address-label">Address</span>
          <div className="dd-browser-address-input-wrap">
            <input
              className="dd-browser-address-input"
              type="text"
              value={addressValue}
              onChange={(e) => setAddressValue(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
            />
            <button className="dd-browser-address-dropdown" tabIndex={-1}>▾</button>
          </div>
          <button className="dd-browser-go-btn" onClick={handleGo}>Go</button>
        </div>

        {/* Content area */}
        <div className="dd-browser-content">{children}</div>
      </div>
    </Window>
  );
}
