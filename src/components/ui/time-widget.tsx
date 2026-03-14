"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn, formatDisplayDate, formatDisplayTime } from "@/lib/utils";

export function TimeWidget() {
  const { language, dir, t } = useI18n();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000 * 30);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className={cn(
        "rounded-[1.7rem] border border-gold/12 bg-black/20 p-4",
        dir === "rtl" ? "text-right" : "text-left",
      )}
    >
      <div className={cn("flex items-center justify-between gap-4", dir === "rtl" ? "flex-row-reverse" : "flex-row")}>
        <div className="rounded-2xl bg-amber-200/10 p-3 text-gold">
          <Clock3 className="h-6 w-6" />
        </div>
        <div>
          <p className="font-display text-4xl leading-none text-foreground md:text-5xl">
            {formatDisplayTime(now, language)}
          </p>
          <p className="mt-2 text-sm text-white/55">{t("time.welcome")}</p>
        </div>
      </div>
      <div
        className={cn(
          "mt-4 flex items-center gap-2 text-sm text-white/58",
          dir === "rtl" ? "justify-end" : "justify-start",
        )}
      >
        <span>{formatDisplayDate(now, language)}</span>
        <CalendarDays className="h-4 w-4 text-gold-soft" />
      </div>
    </div>
  );
}
