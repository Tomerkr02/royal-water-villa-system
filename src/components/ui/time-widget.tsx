"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";
import { formatDisplayDate, formatDisplayTime } from "@/lib/utils";

export function TimeWidget() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000 * 30);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="rounded-[1.7rem] border border-gold/12 bg-black/20 p-4 text-right">
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-2xl bg-amber-200/10 p-3 text-gold">
          <Clock3 className="h-6 w-6" />
        </div>
        <div>
          <p className="font-display text-4xl leading-none text-foreground md:text-5xl">
            {formatDisplayTime(now)}
          </p>
          <p className="mt-2 text-sm text-white/55">ברוכים הבאים לחוויית האירוח שלכם</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 text-sm text-white/58">
        <span>{formatDisplayDate(now)}</span>
        <CalendarDays className="h-4 w-4 text-gold-soft" />
      </div>
    </div>
  );
}
