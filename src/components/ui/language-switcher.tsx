"use client";

import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n, type Language } from "@/lib/i18n";

const languages: Language[] = ["he", "en"];

export function LanguageSwitcher() {
  const { language, setLanguage, t, dir } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-2 py-2 backdrop-blur-sm",
        dir === "rtl" ? "flex-row-reverse" : "flex-row",
      )}
      aria-label={t("language.label")}
    >
      <span className="rounded-full bg-white/6 p-2 text-gold-soft">
        <Languages className="h-4 w-4" />
      </span>
      <div className="flex items-center gap-1">
        {languages.map((entry) => {
          const active = language === entry;
          return (
            <button
              key={entry}
              type="button"
              onClick={() => setLanguage(entry)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors",
                active
                  ? "bg-amber-200/12 text-foreground"
                  : "text-white/58 hover:bg-white/6 hover:text-foreground",
              )}
            >
              {t(`language.${entry}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
