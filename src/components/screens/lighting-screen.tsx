import { DeviceCard } from "@/components/ui/device-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useControlStore } from "@/store/control-store";

export function LightingScreen() {
  const devices = useControlStore((state) => state.devices);
  const toggleDevice = useControlStore((state) => state.toggleDevice);

  return (
    <div>
      <SectionHeading
        eyebrow="תאורה"
        title="שליטה חכמה בתאורת הווילה"
        description="כרטיסים גדולים, חיווי ברור של מצב דלוק או כבוי, ונוחות לחיצה שתוכננה במיוחד לטאבלט אנדרואיד במסך אופקי."
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
