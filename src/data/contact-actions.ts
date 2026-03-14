import { MessageCircleMore, Phone, ShieldAlert } from "lucide-react";
import type { ContactAction } from "@/types/models";

export const contactActionsSeed: ContactAction[] = [
  {
    id: "call",
    label: "התקשרות למארח",
    description: "לשיחה מיידית במקרה של שאלה או צורך דחוף.",
    href: "tel:+972500000000",
    icon: Phone,
  },
  {
    id: "whatsapp",
    label: "וואטסאפ",
    description: "לשליחת הודעה מהירה, בקשות ושאלות במהלך השהייה.",
    href: "https://wa.me/972500000000",
    icon: MessageCircleMore,
  },
  {
    id: "service",
    label: "פנייה לשירות",
    description: "קישור זמני למסלול עתידי של בקשת שירות מסודרת.",
    href: "mailto:host@royalwatervilla.example",
    icon: ShieldAlert,
  },
];
