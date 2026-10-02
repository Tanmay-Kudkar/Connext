"use client";

import { useEffect, useState } from "react";

const KEY = "connext-first-credit";

export function celebrateFirstCredit() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(KEY)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.localStorage.setItem(KEY, "1");
    return;
  }
  window.dispatchEvent(new Event("connext:first-credit"));
  window.localStorage.setItem(KEY, "1");
}

export function FirstCreditBurst() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onBurst() {
      setShow(true);
      window.setTimeout(() => setShow(false), 900);
    }
    window.addEventListener("connext:first-credit", onBurst);
    return () => window.removeEventListener("connext:first-credit", onBurst);
  }, []);

  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{
            left: `${8 + ((i * 17) % 84)}%`,
            top: `${10 + ((i * 13) % 70)}%`,
            background: i % 2 ? "var(--accent)" : "var(--text-primary)",
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
}
