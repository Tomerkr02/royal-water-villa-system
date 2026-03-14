"use client";

import { motion } from "framer-motion";
import { Power } from "lucide-react";
import { getTranslationObject, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Device } from "@/types/models";

export function DeviceCard({
  device,
  onToggle,
}: {
  device: Device;
  onToggle: () => void;
}) {
  const { language, dir, t } = useI18n();
  const Icon = device.icon;
  const copy = getTranslationObject<{
    name: string;
    description: string;
    location: string;
  }>(language, `devices.${device.id}`);

  return (
    <motion.button
      layout
      type="button"
      onClick={onToggle}
      className={cn(
        "relative overflow-hidden rounded-[2rem] border p-5 transition-all duration-300",
        dir === "rtl" ? "text-right" : "text-left",
        device.isOn
          ? "border-gold/28 bg-white/[0.06] shadow-[0_24px_60px_rgba(0,0,0,0.24)]"
          : "border-white/7 bg-white/[0.03]",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          device.accent,
          device.isOn ? "opacity-100" : "opacity-45",
        )}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_40%)]" />
      <div className="relative flex h-full flex-col justify-between gap-6">
        <div className={cn("flex items-start justify-between gap-3", dir === "rtl" ? "flex-row-reverse" : "flex-row")}>
          <span
            className={cn(
              "rounded-[1.25rem] p-3",
              device.isOn ? "bg-amber-200/14 text-gold" : "bg-white/6 text-white/50",
            )}
          >
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs tracking-[0.28em] text-white/45">{copy.location}</p>
            <h3 className="mt-3 text-2xl font-semibold text-foreground">{copy.name}</h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-white/58">{copy.description}</p>
          </div>
        </div>

        <div className={cn("flex items-end justify-between gap-3", dir === "rtl" ? "flex-row-reverse" : "flex-row")}>
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs tracking-[0.2em]",
              device.isOn
                ? "border-emerald-300/30 bg-emerald-300/12 text-emerald-100"
                : "border-white/10 bg-black/15 text-white/52",
            )}
          >
            <Power className="h-3.5 w-3.5" />
            {device.isOn ? t("common.tapToTurnOff") : t("common.tapToTurnOn")}
          </span>
          <div className={dir === "rtl" ? "text-right" : "text-left"}>
            <p className="text-xs tracking-[0.2em] text-white/42">{t("common.state")}</p>
            <p className={cn("mt-2 text-lg font-semibold", device.isOn ? "text-emerald-100" : "text-white/55")}>
              {device.isOn ? t("common.activeState") : t("common.inactiveState")}
            </p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
