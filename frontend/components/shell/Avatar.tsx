import { cn } from "@/lib/utils";

export function Avatar({
  initials,
  size = 36,
  className,
}: {
  initials: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("avatar flex items-center justify-center text-small font-semibold", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
