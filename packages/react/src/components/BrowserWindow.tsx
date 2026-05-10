import { useState, useRef, type ReactNode } from "react";
import { Window, type WindowProps } from "./Window";
import "./BrowserWindow.css";

export interface BrowserWindowProps extends Omit<WindowProps, "children" | "scrollContent" | "bodyOverflow"> {
  url?: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
  status?: string;
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
  status = "Done",
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
        <div className="dd-browser-content dd-scrollable dd-scrollable--fill">{children}</div>

        {/* Status bar */}
        <div className="dd-browser-statusbar">
          <span className="dd-browser-status-text">{status}</span>
          <div className="dd-browser-status-zone">
            <span className="dd-browser-status-zone-icon">🌐</span>
            <span>Internet</span>
          </div>
        </div>
      </div>
    </Window>
  );
}

export interface BrowserErrorPageProps {
  url?: string;
  onRefresh?: () => void;
}

export function BrowserErrorPage({ url, onRefresh }: BrowserErrorPageProps) {
  return (
    <div className="dd-browser-error">
      <div className="dd-browser-error-title">
        <span className="dd-browser-error-icon">🚫</span>
        <span>The page cannot be displayed</span>
      </div>
      <hr className="dd-browser-error-hr" />
      <p>The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings.</p>
      <hr className="dd-browser-error-hr" />
      <p><strong>Please try the following:</strong></p>
      <ul>
        <li>Click the <button className="dd-browser-error-link" onClick={onRefresh}><strong>Refresh</strong></button> button, or try again later.</li>
        <li>If you typed the page address in the Address bar, make sure that it is spelled correctly.</li>
        <li>To check your connection settings, click the <strong>Tools</strong> menu, and then click <strong>Internet Options</strong>. On the <strong>Connections</strong> tab, click <strong>Settings</strong>.</li>
      </ul>
      {url && (
        <p className="dd-browser-error-detail">
          Cannot display the webpage: <code>{url}</code>
        </p>
      )}
      <hr className="dd-browser-error-hr" />
      <p className="dd-browser-error-code">HTTP 403 — Forbidden: This page has refused to connect.</p>
    </div>
  );
}
