import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import axios from "axios";
// const theme: DefaultTheme = {};

const ThemeContext = createContext({
  theme: "light",
  setTheme: (t: string) => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
      return "dark";
    return "light";
  });

  const getTheme = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/organization/getTheme`,
        {
          params: { token },
        }
      );

      if (res.status === 200) {
        const apiTheme =
          typeof res.data === "string" ? res.data : res.data.theme;
        if (apiTheme === "light" || apiTheme === "dark") {
          setTheme(apiTheme);
        } else {
          console.warn("Unknown theme from API:", apiTheme);
        }
      }
    } catch (error) {
      console.error("Error while getting theme", error);
    }
  };

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    getTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <StyledThemeProvider theme={{ theme }}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
