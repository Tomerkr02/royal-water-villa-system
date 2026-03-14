import { ContactCard } from "@/components/ui/contact-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useControlStore } from "@/store/control-store";

export function ContactScreen() {
  const contactActions = useControlStore((state) => state.contactActions);

  return (
    <div>
      <SectionHeading
        eyebrow="יצירת קשר"
        title="נשמח לעזור בכל רגע"
        description="גישה מהירה ונוחה למארח או לשירות במהלך השהייה. הקישורים יכולים בהמשך להתחבר למספרים אמיתיים, לוואטסאפ או לזרימת שירות ייעודית."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {contactActions.map((action) => (
          <ContactCard key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
}
