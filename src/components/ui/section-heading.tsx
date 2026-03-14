"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  const { dir } = useI18n();

  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 lg:items-end lg:justify-between",
        dir === "rtl" ? "lg:flex-row-reverse" : "lg:flex-row",
      )}
    >
      <div className={cn(dir === "rtl" ? "text-right" : "text-left")}>
        <p className="text-xs tracking-[0.28em] text-gold-soft/80">{eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl leading-none text-foreground md:text-5xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
