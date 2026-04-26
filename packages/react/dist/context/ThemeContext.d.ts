import { ReactNode } from 'react';
export type DreamDeskTheme = "pastelcore" | "dark" | "vista";
interface ThemeContextValue {
    theme: DreamDeskTheme;
    setTheme: (theme: DreamDeskTheme) => void;
}
export declare function ThemeProvider({ children, defaultTheme }: {
    children: ReactNode;
    defaultTheme?: DreamDeskTheme;
}): import("react/jsx-runtime").JSX.Element;
export declare function useTheme(): ThemeContextValue;
export {};
//# sourceMappingURL=ThemeContext.d.ts.map