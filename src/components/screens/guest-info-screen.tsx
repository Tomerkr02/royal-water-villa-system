import { GuestInfoCard } from "@/components/ui/guest-info-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useI18n } from "@/lib/i18n";
import { useControlStore } from "@/store/control-store";

export function GuestInfoScreen() {
  const { t } = useI18n();
  const guestInfo = useControlStore((state) => state.guestInfo);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow={t("guest.eyebrow")}
        title={t("guest.title")}
        description={t("guest.description")}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:gap-6">
        {guestInfo.map((item) => (
          <GuestInfoCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
