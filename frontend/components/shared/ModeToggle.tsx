"use client";

import { useState } from "react";

export default function ModeToggle() {
    const [mode, setMode] = useState<"vibe" | "pro">("vibe");

    return (
        <div className="flex items-center rounded-xl border border-gray-200 bg-gray-100 p-1 dark:border-white/10 dark:bg-white/5">
            <button
                onClick={() => setMode("vibe")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${mode === "vibe"
                    ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
                    : "text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                    }`}
            >
                ⚡ Vibe
            </button>

            <button
                onClick={() => setMode("pro")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${mode === "pro"
                    ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
                    : "text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                    }`}
            >
                💼 Pro
            </button>
        </div>
    );
}