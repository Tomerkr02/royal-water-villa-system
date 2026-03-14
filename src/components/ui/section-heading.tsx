"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  const { dir } = useI18n();

  return (
    <div
      className={cn(
        compact
          ? "mb-4 flex flex-col gap-3 lg:items-end lg:justify-between"
          : "mb-6 flex flex-col gap-4 lg:items-end lg:justify-between",
        dir === "rtl" ? "lg:flex-row-reverse" : "lg:flex-row",
      )}
    >
      <div className={cn(dir === "rtl" ? "text-right" : "text-left")}>
        <p className="text-xs tracking-[0.28em] text-gold-soft/80">{eyebrow}</p>
        <h2
          className={cn(
            "font-display leading-none text-foreground",
            compact ? "mt-2 text-[2rem] md:text-[2.45rem]" : "mt-3 text-4xl md:text-5xl",
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            "max-w-2xl text-white/60",
            compact ? "mt-2 text-sm leading-6 md:text-[0.95rem]" : "mt-3 text-sm leading-7 md:text-base",
          )}
        >
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
