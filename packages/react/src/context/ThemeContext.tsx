import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type DreamDeskTheme = "pastelcore" | "dark" | "vista";

interface ThemeContextValue {
  theme: DreamDeskTheme;
  setTheme: (theme: DreamDeskTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children, defaultTheme = "pastelcore" }: { children: ReactNode; defaultTheme?: DreamDeskTheme }) {
  const [theme, setThemeState] = useState<DreamDeskTheme>(defaultTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback((next: DreamDeskTheme) => {
    setThemeState(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const fallbackTheme: ThemeContextValue = {
  theme: "pastelcore",
  setTheme: () => {},
};

export function useTheme() {
  return useContext(ThemeContext) ?? fallbackTheme;
}
