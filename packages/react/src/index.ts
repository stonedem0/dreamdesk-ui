export { ThemeProvider, useTheme } from "./context/ThemeContext";

export { Desktop, useWindowManager } from "./components/Desktop";
export type { DesktopProps } from "./components/Desktop";

export { Taskbar } from "./components/Taskbar";
export type { TaskbarProps } from "./components/Taskbar";

export { DesktopIcon } from "./components/DesktopIcon";
export type { DesktopIconProps } from "./components/DesktopIcon";

export { Icon } from "./components/Icon";
export type { IconProps } from "./components/Icon";
export type { DreamDeskTheme } from "./context/ThemeContext";

export { Window } from "./components/Window";
export type { WindowProps } from "./components/Window";

export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";
export { Toast } from "./components/Toast";
export type { ToastProps } from "./components/Toast";
export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";
export { ProgressBar } from "./components/ProgressBar";
export type { ProgressBarProps } from "./components/ProgressBar";
export { Tabs, Tab, TabPanel } from "./components/Tabs";
export type { TabsProps, TabProps, TabPanelProps } from "./components/Tabs";
export { Toggle } from "./components/Toggle";
export type { ToggleProps } from "./components/Toggle";
export { TerminalWindow } from "./components/TerminalWindow";
export type { TerminalWindowProps } from "./components/TerminalWindow";

export { BrowserWindow, BrowserErrorPage } from "./components/BrowserWindow";
export type { BrowserWindowProps, BrowserErrorPageProps } from "./components/BrowserWindow";

export { ContextMenu, useContextMenu } from "./components/ContextMenu";
export type { ContextMenuItem, ContextMenuProps } from "./components/ContextMenu";

export { Dialog, DialogProvider, useDialog } from "./components/Dialog";
export type { DialogProps, DialogAction, DialogAPI } from "./components/Dialog";
