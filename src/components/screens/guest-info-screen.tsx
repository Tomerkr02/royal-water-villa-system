import { GuestInfoCard } from "@/components/ui/guest-info-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useControlStore } from "@/store/control-store";

export function GuestInfoScreen() {
  const guestInfo = useControlStore((state) => state.guestInfo);

  return (
    <div>
      <SectionHeading
        eyebrow="מידע לאורח"
        title="כל מה שחשוב לדעת במהלך השהייה"
        description="מסך תוכן נקי וקריא שמבוסס על קונפיגורציה, כך שניתן לעדכן בקלות פרטי Wi-Fi, כללי המקום, מידע על הבריכה ושעות הצ'ק אין והצ'ק אאוט."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {guestInfo.map((item) => (
          <GuestInfoCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
