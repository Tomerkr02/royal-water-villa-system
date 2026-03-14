"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Info, Lamp, Power, Sparkles } from "lucide-react";
import { GuestInfoScreen } from "@/components/screens/guest-info-screen";
import { HomeScreen } from "@/components/screens/home-screen";
import { LightingScreen } from "@/components/screens/lighting-screen";
import { ScenesScreen } from "@/components/screens/scenes-screen";
import { ActionButton } from "@/components/ui/action-button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { SplashScreen } from "@/components/ui/splash-screen";
import { TimeWidget } from "@/components/ui/time-widget";
import { ToastRegion } from "@/components/ui/toast-region";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { getProviderName } from "@/services/provider-registry";
import { useControlStore } from "@/store/control-store";
import type { ScreenKey } from "@/types/models";

const navigationItems: Array<{ key: ScreenKey; labelKey: string; icon: typeof Home }> = [
  { key: "home", labelKey: "nav.home", icon: Home },
  { key: "lighting", labelKey: "nav.lighting", icon: Lamp },
  { key: "scenes", labelKey: "nav.scenes", icon: Sparkles },
  { key: "guest", labelKey: "nav.guest", icon: Info },
];

export function ControlDashboard() {
  const { t, dir } = useI18n();
  const {
    activeScreen,
    booting,
    loading,
    confirmPowerOffOpen,
    initialize,
    setActiveScreen,
    setConfirmPowerOffOpen,
    turnOffAll,
  } = useControlStore();

  useEffect(() => {
    console.log("[Control dashboard] initialized", {
      currentProviderName: getProviderName(),
    });
    void initialize();
  }, [initialize]);

  return (
    <main className="tablet-shell relative min-h-screen overflow-hidden px-3 py-3 text-foreground md:px-5 md:py-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-8 top-8 h-48 w-48 rounded-full bg-amber-200/8 blur-3xl" />
        <div className="absolute bottom-6 left-6 h-56 w-56 rounded-full bg-sky-300/8 blur-3xl" />
      </div>

      <div
        dir="ltr"
        className={cn(
          "relative mx-auto flex min-h-[calc(100dvh-1.5rem)] max-w-[1680px] flex-col gap-3 lg:min-h-[calc(100dvh-2rem)]",
          "lg:flex-row",
        )}
      >
        <aside
          dir={dir}
          className={cn(
            "glass-panel luxury-ring flex w-full shrink-0 flex-row items-center justify-between rounded-[2rem] px-4 py-4 lg:w-[340px] lg:flex-col lg:items-stretch lg:justify-start lg:gap-5 lg:px-6 lg:py-6",
            dir === "rtl" ? "lg:order-2" : "lg:order-1",
          )}
        >
          <div className="space-y-4">
            <div className={cn("space-y-2", dir === "rtl" ? "text-right" : "text-left")}>
              <p className="font-sans text-xs tracking-[0.35em] text-gold-soft/80">
                {t("common.brand")}
              </p>
              <h1 className="font-display text-3xl leading-none text-foreground md:text-[2.7rem]">
                {t("dashboard.title")}
              </h1>
              <p className="max-w-xs text-sm leading-6 text-white/62">
                {t("dashboard.description")}
              </p>
            </div>

            <TimeWidget />
            <div className={cn("pt-1", dir === "rtl" ? "text-right" : "text-left")}>
              <LanguageSwitcher />
            </div>
          </div>

          <nav className="hidden gap-3 lg:flex lg:flex-col">
            {navigationItems.map(({ key, labelKey, icon: Icon }) => {
              const active = activeScreen === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveScreen(key)}
                  className={cn(
                    "flex items-center gap-4 rounded-[1.6rem] border px-4 py-4 transition-all duration-300",
                    dir === "rtl" ? "flex-row-reverse" : "flex-row",
                    dir === "rtl" ? "text-right" : "text-left",
                    active
                      ? "border-gold/40 bg-gradient-to-r from-amber-200/12 to-sky-300/8 text-foreground"
                      : "border-white/6 bg-white/4 text-white/65 hover:border-gold/20 hover:bg-white/6",
                  )}
                >
                  <span
                    className={cn(
                      "rounded-2xl p-3",
                      active ? "bg-amber-200/14 text-gold" : "bg-white/6 text-white/60",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{t(labelKey)}</p>
                    <p className="text-xs text-white/45">{t("common.quickAccess")}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <ActionButton
              icon={Power}
              label={t("dashboard.allLightsOffLabel")}
              description={t("dashboard.allLightsOffDescription")}
              variant="danger"
              onClick={() => setConfirmPowerOffOpen(true)}
            />
          </div>

          <nav className="grid flex-1 grid-cols-4 gap-2 lg:hidden">
            {navigationItems.map(({ key, labelKey, icon: Icon }) => {
              const active = activeScreen === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveScreen(key)}
                  className={cn(
                    "rounded-[1.3rem] border px-2 py-3 text-center transition-all",
                    active
                      ? "border-gold/40 bg-amber-200/10 text-gold"
                      : "border-white/6 bg-white/4 text-white/60",
                  )}
                >
                  <Icon className="mx-auto mb-2 h-5 w-5" />
                  <span className="text-[11px] font-medium">{t(labelKey)}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section
          dir={dir}
          className={cn(
            "glass-panel luxury-ring relative flex min-h-[72vh] flex-1 flex-col overflow-hidden rounded-[2.4rem] border border-white/6 p-4 md:p-6 lg:p-7",
            dir === "rtl" ? "lg:order-1" : "lg:order-2",
          )}
        >
          <div className={cn("absolute top-4 hidden items-center gap-3 lg:flex", dir === "rtl" ? "right-4" : "left-4")}>
            <div
              className={cn(
                "rounded-full border px-4 py-2 text-xs tracking-[0.22em]",
                loading
                  ? "border-sky-300/30 bg-sky-300/10 text-sky-100"
                  : "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
              )}
            >
              {loading ? t("common.syncing") : t("common.ready")}
            </div>
            <ActionButton
              icon={Power}
              label={t("dashboard.fullShutdownLabel")}
              description={t("dashboard.fullShutdownDescription")}
              variant="danger"
              compact
              onClick={() => setConfirmPowerOffOpen(true)}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="scrollbar-hidden flex-1 overflow-auto pt-14 lg:pt-0"
            >
              {activeScreen === "home" && <HomeScreen onNavigate={setActiveScreen} />}
              {activeScreen === "lighting" && <LightingScreen />}
              {activeScreen === "scenes" && <ScenesScreen />}
              {activeScreen === "guest" && <GuestInfoScreen />}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      <AnimatePresence>{booting ? <SplashScreen /> : null}</AnimatePresence>

      <ConfirmDialog
        open={confirmPowerOffOpen}
        title={t("dashboard.confirmAllOffTitle")}
        description={t("dashboard.confirmAllOffDescription")}
        confirmLabel={t("dashboard.confirmAllOffButton")}
        onClose={() => setConfirmPowerOffOpen(false)}
        onConfirm={() => void turnOffAll()}
      />

      <ToastRegion />
    </main>
  );
}
