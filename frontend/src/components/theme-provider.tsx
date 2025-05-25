import  { type ReactNode } from "react";
import { ThemeProvider as StyledThemeProvider, type DefaultTheme } from "styled-components";

const theme: DefaultTheme = {
    colors: {
        primary: "#0070f3",
        secondary: "#1a1a1a",
        background: "#000",
        text: "#333",
    },
    borderRadius: "4px",
};

type ThemeProviderProps = {
    children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => (
    <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
);