import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type DreamDeskTheme = "pastelcore" | "dark";

interface ThemeContextValue {
  theme: DreamDeskTheme;
  setTheme: (theme: DreamDeskTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children, defaultTheme = "pastelcore" }: { children: ReactNode; defaultTheme?: DreamDeskTheme }) {
  const [theme, setThemeState] = useState<DreamDeskTheme>(defaultTheme);

  const setTheme = useCallback((next: DreamDeskTheme) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
