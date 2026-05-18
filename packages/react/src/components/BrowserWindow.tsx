import { useState, useEffect, useRef, type ReactNode } from "react";
import { Window, type WindowProps } from "./Window";
import { Toolbar, ToolbarButton, ToolbarSeparator } from "./Toolbar";
import { StatusBar, StatusBarSection } from "./StatusBar";
import "./BrowserWindow.css";

export interface BrowserWindowProps extends Omit<WindowProps, "children" | "scrollContent" | "bodyOverflow"> {
  url?: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
  status?: string;
  history?: string[];
  onNavigate?: (url: string) => void;
  onBack?: () => void;
  onForward?: () => void;
  onStop?: () => void;
  onRefresh?: () => void;
  onHome?: () => void;
  // toolbar icon overrides — SVG string, URL, or plain unicode char
  backIcon?: string;
  forwardIcon?: string;
  stopIcon?: string;
  refreshIcon?: string;
  homeIcon?: string;
  historyIcon?: string;
  children?: ReactNode;
}

export function BrowserWindow({
  url = "",
  canGoBack = false,
  canGoForward = false,
  status = "Done",
  history = [],
  onNavigate,
  onBack,
  onForward,
  onStop,
  onRefresh,
  onHome,
  backIcon = "←",
  forwardIcon = "→",
  stopIcon = "✕",
  refreshIcon = "↻",
  homeIcon = "⌂",
  historyIcon = "⊞",
  children,
  className,
  ...windowProps
}: BrowserWindowProps) {
  const [addressValue, setAddressValue] = useState(url);
  const [showHistory, setShowHistory] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAddressValue(url);
  }, [url]);

  useEffect(() => {
    if (!showHistory) return;
    const handler = (e: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showHistory]);

  const handleGo = () => {
    const target = addressValue.trim();
    if (target) onNavigate?.(target);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleGo();
  };

  return (
    <Window
      {...windowProps}
      className={["dd-browser-window", className].filter(Boolean).join(" ")}
      bodyOverflow="hidden"
    >
      <div className="dd-browser">
        {/* Toolbar row */}
        <Toolbar className="dd-browser-toolbar">
          <ToolbarButton icon={backIcon}    label="Back"    disabled={!canGoBack}    onClick={onBack} />
          <ToolbarButton icon={forwardIcon} label="Forward" disabled={!canGoForward} onClick={onForward} />
          <ToolbarSeparator />
          <ToolbarButton icon={stopIcon}    label="Stop"    onClick={onStop} />
          <ToolbarButton icon={refreshIcon} label="Refresh" onClick={onRefresh} />
          <ToolbarButton icon={homeIcon}    label="Home"    onClick={onHome} />
          <ToolbarSeparator />
          <ToolbarButton icon={historyIcon} label="History" active={showHistory} onClick={() => setShowHistory(v => !v)} />

          {/* History dropdown */}
          {showHistory && history.length > 0 && (
            <div ref={historyRef} className="dd-browser-history-dropdown">
              {[...history].reverse().map((href, i) => (
                <button
                  key={i}
                  className="dd-browser-history-item"
                  onClick={() => { onNavigate?.(href); setShowHistory(false); }}
                >
                  {href}
                </button>
              ))}
            </div>
          )}
        </Toolbar>

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
        <StatusBar className="dd-browser-statusbar">
          <StatusBarSection flex>{status}</StatusBarSection>
          <StatusBarSection><span className="dd-browser-status-zone-icon">🌐</span> Internet</StatusBarSection>
        </StatusBar>
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
