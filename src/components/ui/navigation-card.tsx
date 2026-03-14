"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function NavigationCard({
  title,
  description,
  icon: Icon,
  accent,
  onClick,
  compact = false,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  onClick: () => void;
  compact?: boolean;
}) {
  const { dir } = useI18n();

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/4 transition-all duration-300 hover:-translate-y-1 hover:border-gold/24 hover:bg-white/6",
        compact ? "min-h-[168px] p-4" : "p-5",
        dir === "rtl" ? "text-right" : "text-left",
      )}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-80`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_32%)]" />
      <div className={cn("relative flex h-full flex-col justify-between", compact ? "gap-6" : "gap-10")}>
        <div className={cn("flex items-start justify-between", dir === "rtl" ? "flex-row-reverse" : "flex-row")}>
          <ArrowUpRight className="h-5 w-5 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          <span className={cn("bg-black/20 text-gold shadow-lg shadow-black/20", compact ? "rounded-[1.15rem] p-2.5" : "rounded-[1.4rem] p-3")}>
            <Icon className={cn(compact ? "h-6 w-6" : "h-7 w-7")} />
          </span>
        </div>
        <div>
          <h3 className={cn("font-semibold text-foreground", compact ? "text-lg" : "text-xl")}>{title}</h3>
          <p className={cn("text-white/60", compact ? "mt-1.5 text-sm leading-5" : "mt-2 text-sm leading-6")}>
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
