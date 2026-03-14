"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Headphones, Home, Info, Lamp, Power, Sparkles } from "lucide-react";
import { ContactScreen } from "@/components/screens/contact-screen";
import { GuestInfoScreen } from "@/components/screens/guest-info-screen";
import { HomeScreen } from "@/components/screens/home-screen";
import { LightingScreen } from "@/components/screens/lighting-screen";
import { ScenesScreen } from "@/components/screens/scenes-screen";
import { ActionButton } from "@/components/ui/action-button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SplashScreen } from "@/components/ui/splash-screen";
import { TimeWidget } from "@/components/ui/time-widget";
import { ToastRegion } from "@/components/ui/toast-region";
import { cn } from "@/lib/utils";
import { getProviderName } from "@/services/provider-registry";
import { useControlStore } from "@/store/control-store";
import type { ScreenKey } from "@/types/models";

const navigationItems: Array<{ key: ScreenKey; label: string; icon: typeof Home }> = [
  { key: "home", label: "ראשי", icon: Home },
  { key: "lighting", label: "תאורה", icon: Lamp },
  { key: "scenes", label: "מצבים", icon: Sparkles },
  { key: "guest", label: "מידע לאורח", icon: Info },
  { key: "contact", label: "יצירת קשר", icon: Headphones },
];

export function ControlDashboard() {
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

      <div className="relative mx-auto flex min-h-[calc(100dvh-1.5rem)] max-w-[1680px] flex-col gap-3 lg:min-h-[calc(100dvh-2rem)] lg:flex-row-reverse">
        <aside className="glass-panel luxury-ring flex w-full shrink-0 flex-row items-center justify-between rounded-[2rem] px-4 py-4 lg:w-[340px] lg:flex-col lg:items-stretch lg:justify-start lg:gap-5 lg:px-6 lg:py-6">
          <div className="space-y-4">
            <div className="space-y-2 text-right">
              <p className="font-sans text-xs tracking-[0.35em] text-gold-soft/80">
                Royal Water Villa
              </p>
              <h1 className="font-display text-3xl leading-none text-foreground md:text-[2.7rem]">
                לוח בקרה לאורחים
              </h1>
              <p className="max-w-xs text-sm leading-6 text-white/62">
                מערכת אירוח שקטה, מהירה ויוקרתית, שנבנתה במיוחד כדי להרגיש כמו חלק
                טבעי מהשהייה ב-Royal Water Villa.
              </p>
            </div>

            <TimeWidget />
          </div>

          <nav className="hidden gap-3 lg:flex lg:flex-col">
            {navigationItems.map(({ key, label, icon: Icon }) => {
              const active = activeScreen === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveScreen(key)}
                  className={cn(
                    "flex items-center gap-4 rounded-[1.6rem] border px-4 py-4 text-right transition-all duration-300",
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
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-white/45">גישה מהירה</p>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <ActionButton
              icon={Power}
              label="כיבוי כל התאורות"
              description="כיבוי מלא ואלגנטי של כל אזורי התאורה בווילה."
              variant="danger"
              onClick={() => setConfirmPowerOffOpen(true)}
            />
          </div>

          <nav className="grid flex-1 grid-cols-5 gap-2 lg:hidden">
            {navigationItems.map(({ key, label, icon: Icon }) => {
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
                  <span className="text-[11px] font-medium">{label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="glass-panel luxury-ring relative flex min-h-[72vh] flex-1 flex-col overflow-hidden rounded-[2.4rem] border border-white/6 p-4 md:p-6 lg:p-7">
          <div className="absolute left-4 top-4 hidden items-center gap-3 lg:flex">
            <div
              className={cn(
                "rounded-full border px-4 py-2 text-xs tracking-[0.22em]",
                loading
                  ? "border-sky-300/30 bg-sky-300/10 text-sky-100"
                  : "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
              )}
            >
              {loading ? "מסנכרן" : "מוכן"}
            </div>
            <ActionButton
              icon={Power}
              label="כיבוי מלא"
              description="כיבוי מיידי של כל התאורות בלחיצה אחת."
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
              {activeScreen === "contact" && <ContactScreen />}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      <AnimatePresence>{booting ? <SplashScreen /> : null}</AnimatePresence>

      <ConfirmDialog
        open={confirmPowerOffOpen}
        title="לכבות את כל התאורות?"
        description="הפעולה תכבה את כל אזורי התאורה הפעילים ברחבי הווילה."
        confirmLabel="כן, לכבות הכל"
        onClose={() => setConfirmPowerOffOpen(false)}
        onConfirm={() => void turnOffAll()}
      />

      <ToastRegion />
    </main>
  );
}
