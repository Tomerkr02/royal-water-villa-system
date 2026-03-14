"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { useControlStore } from "@/store/control-store";

const toneIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function ToastRegion() {
  const toasts = useControlStore((state) => state.toasts);
  const dismissToast = useControlStore((state) => state.dismissToast);

  useEffect(() => {
    if (toasts.length === 0) {
      return;
    }

    const latest = toasts[toasts.length - 1];
    const timer = window.setTimeout(() => {
      dismissToast(latest.id);
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [dismissToast, toasts]);

  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-[60] flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toneIcons[toast.tone];

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="glass-panel pointer-events-auto rounded-[1.5rem] p-4 text-right"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{toast.title}</p>
                  <p className="mt-1 text-sm text-white/58">{toast.message}</p>
                </div>
                <span className="rounded-xl bg-amber-200/10 p-2 text-gold">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
