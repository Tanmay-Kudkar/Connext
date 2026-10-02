"use client";

import { useState } from "react";

export default function ModeToggle() {
    const [mode, setMode] = useState<"vibe" | "pro">("vibe");

    return (
        <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1">
            <button
                onClick={() => setMode("vibe")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${mode === "vibe"
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white"
                    }`}
            >
                ⚡ Vibe
            </button>

            <button
                onClick={() => setMode("pro")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${mode === "pro"
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white"
                    }`}
            >
                💼 Pro
            </button>
        </div>
    );
}