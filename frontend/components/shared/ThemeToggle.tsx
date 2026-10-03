"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ThemeToggleProps {
    variant?: "icon" | "segmented";
    className?: string;
}

export default function ThemeToggle({
    variant = "icon",
    className = "",
}: ThemeToggleProps) {
    const { theme, setTheme, toggleTheme, isLight } = useTheme();

    if (variant === "segmented") {
        return (
            <div
                className={`flex items-center rounded-xl border p-1 transition-colors ${
                    isLight
                        ? "border-gray-200 bg-white shadow-sm"
                        : "border-white/10 bg-white/5"
                } ${className}`}
            >
                <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    aria-label="Switch to dark theme"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                        theme === "dark"
                            ? "bg-white text-black shadow-sm"
                            : isLight
                            ? "text-gray-500 hover:bg-gray-100 hover:text-black"
                            : "text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                >
                    <Moon size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => setTheme("light")}
                    aria-label="Switch to light theme"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                        theme === "light"
                            ? "bg-black text-white shadow-sm"
                            : isLight
                            ? "text-gray-500 hover:bg-gray-100 hover:text-black"
                            : "text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                >
                    <Sun size={16} />
                </button>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
            title={isLight ? "Switch to dark theme" : "Switch to light theme"}
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                isLight
                    ? "border-gray-200 bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 hover:text-black"
                    : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
            } ${className}`}
        >
            {isLight ? (
                <Moon size={18} className="transition-transform duration-300 hover:rotate-12" />
            ) : (
                <Sun size={18} className="transition-transform duration-300 hover:rotate-45" />
            )}
        </button>
    );
}
