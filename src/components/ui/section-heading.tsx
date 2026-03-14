import type { ReactNode } from "react";

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
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="text-right">
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
