import {
  useState,
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
  Children,
  isValidElement,
  type ReactNode,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import "./MenuBar.css";

// ── Context ───────────────────────────────────────────────────────────────────

interface MenuBarCtx {
  openIndex: number | null;
  setOpenIndex: (i: number | null) => void;
}

const MenuBarContext = createContext<MenuBarCtx>({ openIndex: null, setOpenIndex: () => {} });

// ── MenuSeparator ─────────────────────────────────────────────────────────────

export function MenuSeparator() {
  return <div className="dd-menu-separator" />;
}

// ── MenuItem ──────────────────────────────────────────────────────────────────

export interface MenuItemProps {
  children?: ReactNode;
  shortcut?: string;
  checked?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function MenuItem({ children, shortcut, checked, disabled, onClick }: MenuItemProps) {
  const { setOpenIndex } = useContext(MenuBarContext);

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    setOpenIndex(null);
  };

  const handleKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); }
  };

  return (
    <button
      className="dd-menu-item"
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKey}
      role="menuitem"
    >
      {checked !== undefined && (
        <span className="dd-menu-item-check">{checked ? "✓" : ""}</span>
      )}
      <span className="dd-menu-item-label">{children}</span>
      {shortcut && <span className="dd-menu-item-shortcut">{shortcut}</span>}
    </button>
  );
}

// ── Menu ──────────────────────────────────────────────────────────────────────

export interface MenuProps {
  label: string;
  children?: ReactNode;
  // injected by MenuBar
  index?: number;
}

export function Menu({ label, children, index = 0 }: MenuProps) {
  const { openIndex, setOpenIndex } = useContext(MenuBarContext);
  const isOpen = openIndex === index;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const open = () => setOpenIndex(index);
  const close = () => setOpenIndex(null);
  const toggle = () => (isOpen ? close() : open());

  // Hover to switch menus when another is already open
  const handleMouseEnter = () => {
    if (openIndex !== null && openIndex !== index) setOpenIndex(index);
  };

  const handleTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
      // Focus first item after open
      requestAnimationFrame(() => {
        const first = dropdownRef.current?.querySelector<HTMLElement>(".dd-menu-item:not(:disabled)");
        first?.focus();
      });
    }
    if (e.key === "Escape") close();
  };

  const handleDropdownKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") { close(); triggerRef.current?.focus(); }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const items = Array.from(dropdownRef.current?.querySelectorAll<HTMLElement>(".dd-menu-item:not(:disabled)") ?? []);
      const current = document.activeElement as HTMLElement;
      const idx = items.indexOf(current);
      const next = e.key === "ArrowDown"
        ? items[(idx + 1) % items.length]
        : items[(idx - 1 + items.length) % items.length];
      next?.focus();
    }
  };

  return (
    <div style={{ position: "relative" }} onMouseEnter={handleMouseEnter}>
      <button
        ref={triggerRef}
        className="dd-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggle}
        onKeyDown={handleTriggerKey}
      >
        {label}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="dd-menu-dropdown"
          role="menu"
          onKeyDown={handleDropdownKey}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ── MenuBar ───────────────────────────────────────────────────────────────────

export interface MenuBarProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function MenuBar({ children, className, style }: MenuBarProps) {
  const [openIndex, setOpenIndexState] = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const setOpenIndex = useCallback((i: number | null) => setOpenIndexState(i), []);

  // Close on outside click
  useEffect(() => {
    if (openIndex === null) return;
    const handler = (e: MouseEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpenIndexState(null);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [openIndex]);

  // Clone Menu children to inject index
  let menuIndex = 0;
  const injected = Children.map(children, (child) => {
    if (isValidElement(child) && child.type === Menu) {
      return { ...child, props: { ...child.props, index: menuIndex++ } };
    }
    return child;
  });

  return (
    <MenuBarContext.Provider value={{ openIndex, setOpenIndex }}>
      <div
        ref={barRef}
        className={["dd-menubar", className].filter(Boolean).join(" ")}
        style={style}
        role="menubar"
      >
        {injected}
      </div>
    </MenuBarContext.Provider>
  );
}
