"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
    theme: Theme;
    toggleTheme: () => void;
}>({ theme: "dark", toggleTheme: () => { } });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        const stored = localStorage.getItem("srm-theme") as Theme | null;
        const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
        const initial = stored ?? preferred;
        setTheme(initial);
        applyTheme(initial);
    }, []);

    const applyTheme = (t: Theme) => {
        const root = document.documentElement;
        if (t === "dark") {
            root.classList.add("dark");
            root.classList.remove("light");
        } else {
            root.classList.remove("dark");
            root.classList.add("light");
        }
    };

    const toggleTheme = () => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        localStorage.setItem("srm-theme", next);
        applyTheme(next);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
