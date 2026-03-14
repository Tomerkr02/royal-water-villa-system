import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ActionButton({
  icon: Icon,
  label,
  description,
  onClick,
  variant = "default",
  compact = false,
}: {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
  variant?: "default" | "danger";
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-[1.6rem] border px-4 py-3 text-right transition-all duration-300 hover:-translate-y-0.5",
        compact ? "min-w-[220px]" : "w-full",
        variant === "danger"
          ? "border-rose-300/18 bg-gradient-to-r from-rose-400/14 to-amber-300/10 text-white"
          : "border-gold/16 bg-gradient-to-r from-amber-300/12 to-sky-300/8 text-foreground",
      )}
    >
      <span
        className={cn(
          "rounded-2xl p-3",
          variant === "danger" ? "bg-rose-300/12 text-rose-100" : "bg-amber-200/14 text-gold",
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="mt-1 block text-xs text-white/55">{description}</span>
      </span>
    </button>
  );
}
