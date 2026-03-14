"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export function SplashScreen() {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(34,56,92,0.46),transparent_38%),linear-gradient(160deg,#05070d_0%,#09101d_45%,#04070c_100%)]"
    >
      <div className="text-center">
        <p className="text-xs tracking-[0.45em] text-gold-soft/80">{t("common.brand")}</p>
        <h2 className="mt-5 font-display text-6xl text-foreground md:text-7xl">{t("splash.title")}</h2>
        <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <p className="mt-5 text-sm tracking-[0.24em] text-white/50">{t("splash.subtitle")}</p>
      </div>
    </motion.div>
  );
}
