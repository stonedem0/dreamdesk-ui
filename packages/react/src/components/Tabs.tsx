import { useState, Children, isValidElement, type ReactNode, type CSSProperties } from "react";

// ── Tab ──────────────────────────────────────────────────────────────────────

export interface TabProps {
  children?: ReactNode;
  // used internally by Tabs
  index?: number;
  active?: boolean;
  onClick?: (index: number) => void;
}

export function Tab({ children, index = 0, active = false, onClick }: TabProps) {
  return (
    <dreamdesk-tab
      // keep the same element name so existing CSS applies
      class={active ? "active" : undefined}
      data-tab=""
      data-tab-index={String(index)}
      onClick={() => onClick?.(index)}
    >
      {children}
    </dreamdesk-tab>
  );
}

// ── TabPanel ──────────────────────────────────────────────────────────────────

export interface TabPanelProps {
  children?: ReactNode;
  // used internally by Tabs
  active?: boolean;
  style?: CSSProperties;
}

export function TabPanel({ children, active = false, style }: TabPanelProps) {
  return (
    <dreamdesk-tab-panel
      class={active ? "active" : undefined}
      data-panel=""
      style={{ display: active ? "block" : "none", ...style }}
    >
      {children}
    </dreamdesk-tab-panel>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

export interface TabsProps {
  defaultIndex?: number;
  activeIndex?: number;
  onChange?: (index: number) => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Tabs({
  defaultIndex = 0,
  activeIndex: controlledIndex,
  onChange,
  children,
  className,
  style,
}: TabsProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIndex = controlledIndex ?? internalIndex;

  const handleClick = (index: number) => {
    if (controlledIndex === undefined) setInternalIndex(index);
    onChange?.(index);
  };

  // Split children into Tab and TabPanel buckets
  const tabs: ReactNode[] = [];
  const panels: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === Tab) {
      const i = tabs.length;
      tabs.push(
        <Tab key={i} index={i} active={i === activeIndex} onClick={handleClick}>
          {(child.props as TabProps).children}
        </Tab>
      );
    } else if (child.type === TabPanel) {
      const i = panels.length;
      panels.push(
        <TabPanel key={i} active={i === activeIndex} style={(child.props as TabPanelProps).style}>
          {(child.props as TabPanelProps).children}
        </TabPanel>
      );
    }
  });

  return (
    <div className={["tabs", className].filter(Boolean).join(" ")} style={style}>
      <div className="tab-list">{tabs}</div>
      <div className="tab-panels">{panels}</div>
    </div>
  );
}
