import { DeviceCard } from "@/components/ui/device-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useI18n } from "@/lib/i18n";
import { useControlStore } from "@/store/control-store";

export function LightingScreen() {
  const { t } = useI18n();
  const devices = useControlStore((state) => state.devices);
  const toggleDevice = useControlStore((state) => state.toggleDevice);

  return (
    <div>
      <SectionHeading
        eyebrow={t("lighting.eyebrow")}
        title={t("lighting.title")}
        description={t("lighting.description")}
      />

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onToggle={() => {
              console.log("[Lighting screen] switch clicked", {
                clickedDeviceId: device.id,
              });
              void toggleDevice(device.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
