"use client";

import type { GuestInfoItem } from "@/types/models";
import { getTranslationObject, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function GuestInfoCard({ item }: { item: GuestInfoItem }) {
  const { language, dir } = useI18n();
  const copy = getTranslationObject<GuestInfoItem>(language, `guest.${item.id}`);

  return (
    <article
      className={cn(
        "rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-sm",
        dir === "rtl" ? "text-right" : "text-left",
      )}
    >
      <p className="text-[0.7rem] tracking-[0.28em] text-gold-soft/75">{copy.title}</p>

      {copy.value ? (
        <h3 className="mt-4 text-xl font-semibold leading-8 text-foreground md:text-[1.65rem]">
          {copy.value}
        </h3>
      ) : null}

      {copy.entries?.length ? (
        <div className="mt-5 space-y-3">
          {copy.entries.map((entry) => (
            <div
              key={`${item.id}-${entry.label}`}
              className={cn(
                "flex items-center justify-between gap-4 rounded-2xl border border-white/6 bg-black/15 px-4 py-3",
                dir === "rtl" ? "flex-row-reverse" : "flex-row",
              )}
            >
              <span className="text-sm text-white/58">{entry.label}</span>
              <span className="text-base font-semibold tracking-[0.04em] text-foreground md:text-lg">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {copy.bulletPoints?.length ? (
        <ul className="mt-5 space-y-3 text-sm leading-7 text-white/68">
          {copy.bulletPoints.map((bullet) => (
            <li
              key={`${item.id}-${bullet}`}
              className={cn(
                "flex items-start gap-3",
                dir === "rtl" ? "flex-row-reverse text-right" : "flex-row text-left",
              )}
            >
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold-soft/80" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {copy.description ? (
        <p className="mt-4 text-sm leading-7 text-white/58 md:text-[0.95rem]">{copy.description}</p>
      ) : null}

      {copy.emphasis ? (
        <p className="mt-5 border-t border-white/8 pt-4 text-sm leading-7 text-gold-soft/82">
          {copy.emphasis}
        </p>
      ) : null}
    </article>
  );
}
