"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { dir, t } = useI18n();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className={cn(
              "glass-panel w-full max-w-xl rounded-[2rem] p-6",
              dir === "rtl" ? "text-right" : "text-left",
            )}
          >
            <p className="text-xs tracking-[0.24em] text-gold-soft/80">{t("common.actionConfirmation")}</p>
            <h3 className="mt-4 font-display text-4xl text-foreground">{title}</h3>
            <p className="mt-4 text-sm leading-7 text-white/60">{description}</p>

            <div className={cn("mt-8 flex flex-col gap-3", dir === "rtl" ? "sm:flex-row-reverse" : "sm:flex-row")}>
              <button
                type="button"
                onClick={onConfirm}
                className={cn(
                  "rounded-[1.3rem] border border-rose-300/20 bg-rose-300/12 px-5 py-4 text-sm font-semibold text-white",
                  dir === "rtl" ? "text-right" : "text-left",
                )}
              >
                {confirmLabel}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "rounded-[1.3rem] border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white/70",
                  dir === "rtl" ? "text-right" : "text-left",
                )}
              >
                {t("common.cancel")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
