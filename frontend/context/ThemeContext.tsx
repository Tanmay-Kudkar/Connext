"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

export type Theme = "dark" | "light";

interface ThemeContextType {
    theme: Theme;
    isLight: boolean;
    isDark: boolean;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const STORAGE_KEY = "connextTheme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeClass(theme: Theme) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
    } else {
        root.classList.remove("dark");
        root.classList.add("light");
    }
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Read stored theme from localStorage or fallback to initial
        try {
            const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
            if (savedTheme === "light" || savedTheme === "dark") {
                setThemeState(savedTheme);
                applyThemeClass(savedTheme);
            } else {
                // If nothing is saved, default to dark
                applyThemeClass("dark");
            }
        } catch {
            applyThemeClass("dark");
        }

        // Listen for storage events (e.g. if theme changed in another tab or component)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY && (e.newValue === "light" || e.newValue === "dark")) {
                setThemeState(e.newValue);
                applyThemeClass(e.newValue);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        try {
            localStorage.setItem(STORAGE_KEY, newTheme);
        } catch {
            // ignore localStorage quota/privacy errors
        }
        applyThemeClass(newTheme);
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const value = useMemo(
        () => ({
            theme,
            isLight: theme === "light",
            isDark: theme === "dark",
            setTheme,
            toggleTheme,
        }),
        [theme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
