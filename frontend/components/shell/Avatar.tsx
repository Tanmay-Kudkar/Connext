import { cn } from "@/lib/utils";

export function Avatar({
  initials,
  size = 36,
  pack = "initials",
  className,
}: {
  initials: string;
  size?: number;
  pack?: string | null;
  className?: string;
}) {
  const frame =
    pack === "orbit"
      ? "ring-2 ring-offset-2"
      : pack === "glyph"
        ? "rounded-md"
        : pack === "mono"
          ? "grayscale"
          : "";
  return (
    <span
      className={cn(
        "avatar flex items-center justify-center text-small font-semibold",
        frame,
        className,
      )}
      style={{
        width: size,
        height: size,
        outline: pack === "orbit" ? "1.5px solid var(--accent)" : undefined,
        outlineOffset: pack === "orbit" ? 2 : undefined,
        borderRadius: pack === "glyph" ? "0.35rem" : undefined,
        fontFamily: pack === "mono" ? "JetBrains Mono, monospace" : undefined,
      }}
      aria-hidden
    >
      {pack === "glyph" ? initials.slice(0, 1) : initials}
    </span>
  );
}
