import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)} aria-label="Connext home">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
        <circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M14.5 7.2c-1-.8-2.2-1.2-3.5-1.2-3 0-5.3 2.2-5.3 5 0 2.8 2.3 5 5.3 5 1.3 0 2.5-.4 3.5-1.2"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {!compact && <span className="font-semibold tracking-tight">Connext</span>}
    </Link>
  );
}
