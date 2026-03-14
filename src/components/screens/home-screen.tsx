import { Headphones, Info, Lamp, Power, Sparkles } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { NavigationCard } from "@/components/ui/navigation-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useControlStore } from "@/store/control-store";
import type { ScreenKey } from "@/types/models";

export function HomeScreen({
  onNavigate,
}: {
  onNavigate: (screen: ScreenKey) => void;
}) {
  const setConfirmPowerOffOpen = useControlStore((state) => state.setConfirmPowerOffOpen);
  const devices = useControlStore((state) => state.devices);
  const activeCount = devices.filter((device) => device.isOn).length;

  return (
    <div className="flex h-full flex-col">
      <SectionHeading
        eyebrow="קבלת פנים"
        title="ברוכים הבאים ל-Royal Water Villa"
        description="ממשק האירוח של הווילה נבנה כדי להרגיש טבעי, יוקרתי ונעים. התאורה, המצבים, המידע והשירות זמינים כאן במסך אחד נקי ומהיר במיוחד."
      />

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <NavigationCard
            title="תאורה"
            description="שליטה מהירה בכל אזורי התאורה עם כרטיסים גדולים ונוחים למגע."
            icon={Lamp}
            accent="from-amber-300/20 to-transparent"
            onClick={() => onNavigate("lighting")}
          />
          <NavigationCard
            title="מצבים"
            description="הפעלת אווירה מוכנה מראש כמו ערב, רומנטי, בריכה או לילה."
            icon={Sparkles}
            accent="from-sky-300/18 to-transparent"
            onClick={() => onNavigate("scenes")}
          />
          <NavigationCard
            title="מידע לאורח"
            description="Wi-Fi, שעות שהייה, מידע על הבריכה והנחיות שימוש חשובות."
            icon={Info}
            accent="from-emerald-300/18 to-transparent"
            onClick={() => onNavigate("guest")}
          />
          <NavigationCard
            title="יצירת קשר"
            description="גישה מהירה להתקשרות, וואטסאפ או פנייה לשירות."
            icon={Headphones}
            accent="from-rose-300/16 to-transparent"
            onClick={() => onNavigate("contact")}
          />
        </div>

        <div className="rounded-[2rem] border border-white/8 bg-white/[0.035] p-5 text-right">
          <p className="text-xs tracking-[0.24em] text-gold-soft/80">מצב הווילה</p>
          <h3 className="mt-4 font-display text-4xl text-foreground">הכל מוכן לאירוח</h3>
          <p className="mt-4 text-sm leading-7 text-white/58">
            כרגע פועלים {activeCount} אזורי תאורה. אפשר להמשיך לשליטה ידנית או לבחור
            מצב מוכן מראש ליצירת אווירה בלחיצה אחת.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <div className="rounded-[1.6rem] border border-emerald-300/16 bg-emerald-300/8 p-4">
              <p className="text-xs tracking-[0.22em] text-emerald-100/70">תאורה פעילה</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{activeCount}/7</p>
              <p className="mt-2 text-sm text-white/55">אזורים דלוקים כרגע</p>
            </div>
            <div className="rounded-[1.6rem] border border-sky-300/16 bg-sky-300/8 p-4">
              <p className="text-xs tracking-[0.22em] text-sky-100/70">חוויית הפעלה</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">Premium</p>
              <p className="mt-2 text-sm text-white/55">מותאם לטאבלט אורחים אופקי</p>
            </div>
          </div>

          <div className="mt-8">
            <ActionButton
              icon={Power}
              label="כיבוי כל התאורות"
              description="מומלץ לפני יציאה מהווילה או בסיום השהייה."
              variant="danger"
              onClick={() => setConfirmPowerOffOpen(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
