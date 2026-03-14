import { Info, Lamp, Power, Sparkles } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { NavigationCard } from "@/components/ui/navigation-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { interpolate, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useControlStore } from "@/store/control-store";
import type { ScreenKey } from "@/types/models";

export function HomeScreen({
  onNavigate,
}: {
  onNavigate: (screen: ScreenKey) => void;
}) {
  const { t, dir } = useI18n();
  const setConfirmPowerOffOpen = useControlStore((state) => state.setConfirmPowerOffOpen);
  const devices = useControlStore((state) => state.devices);
  const activeCount = devices.filter((device) => device.isOn).length;

  return (
    <div className="flex h-full flex-col">
      <SectionHeading
        eyebrow={t("home.eyebrow")}
        title={t("home.title")}
        description={t("home.description")}
        compact
      />

      <div className="grid gap-3 lg:gap-4 xl:grid-cols-[1.2fr_0.9fr]">
        <div className="grid gap-3 md:grid-cols-2">
          <NavigationCard
            title={t("home.lightingTitle")}
            description={t("home.lightingDescription")}
            icon={Lamp}
            accent="from-amber-300/20 to-transparent"
            onClick={() => onNavigate("lighting")}
            compact
          />
          <NavigationCard
            title={t("home.scenesTitle")}
            description={t("home.scenesDescription")}
            icon={Sparkles}
            accent="from-sky-300/18 to-transparent"
            onClick={() => onNavigate("scenes")}
            compact
          />
          <NavigationCard
            title={t("home.guestTitle")}
            description={t("home.guestDescription")}
            icon={Info}
            accent="from-emerald-300/18 to-transparent"
            onClick={() => onNavigate("guest")}
            compact
          />
        </div>

        <div
          className={cn(
            "rounded-[1.8rem] border border-white/8 bg-white/[0.035] p-4 lg:p-4.5",
            dir === "rtl" ? "text-right" : "text-left",
          )}
        >
          <p className="text-xs tracking-[0.24em] text-gold-soft/80">{t("home.villaStatusLabel")}</p>
          <h3 className="mt-3 font-display text-[2rem] text-foreground lg:text-[2.25rem]">{t("home.villaStatusTitle")}</h3>
          <p className="mt-3 text-sm leading-6 text-white/58">
            {interpolate(t("home.villaStatusDescription"), { activeCount })}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-[1.35rem] border border-emerald-300/16 bg-emerald-300/8 p-3.5">
              <p className="text-xs tracking-[0.22em] text-emerald-100/70">{t("common.activeLighting")}</p>
              <p className="mt-2 text-[1.75rem] font-semibold text-foreground">{activeCount}/12</p>
              <p className="mt-1.5 text-sm text-white/55">{t("common.activeAreas")}</p>
            </div>
            <div className="rounded-[1.35rem] border border-sky-300/16 bg-sky-300/8 p-3.5">
              <p className="text-xs tracking-[0.22em] text-sky-100/70">{t("common.experience")}</p>
              <p className="mt-2 text-[1.75rem] font-semibold text-foreground">{t("common.premium")}</p>
              <p className="mt-1.5 text-sm text-white/55">{t("common.tabletOptimized")}</p>
            </div>
          </div>

          <div className="mt-5">
            <ActionButton
              icon={Power}
              label={t("home.allLightsOffLabel")}
              description={t("home.allLightsOffDescription")}
              variant="danger"
              onClick={() => setConfirmPowerOffOpen(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
