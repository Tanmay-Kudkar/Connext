"use client";

import type { ReactNode } from "react";

export function ListState({
  loading,
  error,
  empty,
  emptyCopy,
  onRetry,
  children,
}: {
  loading?: boolean;
  error?: string;
  empty?: boolean;
  emptyCopy?: ReactNode;
  onRetry?: () => void;
  children: ReactNode;
}) {
  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
      </div>
    );
  }
  if (error) {
    return (
      <div role="alert" className="space-y-3">
        <p className="text-small" style={{ color: "var(--error)" }}>
          {error}
        </p>
        {onRetry && (
          <button type="button" className="btn-ghost hairline" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    );
  }
  if (empty) {
    return <div className="text-muted">{emptyCopy ?? "Nothing here yet."}</div>;
  }
  return <>{children}</>;
}
