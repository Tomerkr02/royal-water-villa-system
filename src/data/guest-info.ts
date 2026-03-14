import type { GuestInfoItem } from "@/types/models";

export const guestInfoSeed: GuestInfoItem[] = [
  {
    id: "wifi-name",
    title: "רשת Wi-Fi",
    value: "RoyalWaterVilla_Guest",
    description: "לגלישה מהירה ויציבה בכל אזורי הווילה.",
  },
  {
    id: "wifi-password",
    title: "סיסמת Wi-Fi",
    value: "Royal2026Guest",
    description: "ניתן לשנות את הסיסמה בקלות דרך קובצי התוכן של המערכת.",
  },
  {
    id: "house-rules",
    title: "כללי המקום",
    value: "נשמח לשמור על שקט נעים בשעות הלילה ועל ציוד הווילה.",
    description: "יש לנעול דלתות ביציאה ולהימנע מהשמעת מוזיקה בעוצמה גבוהה בשעות מאוחרות.",
  },
  {
    id: "bathroom-info",
    title: "מקלחת ושירותים",
    value: "יש להמתין מספר שניות לייצוב המים החמים.",
    description: "נבקש להשתמש במגבות המיועדות לאזור הפנים בלבד.",
  },
  {
    id: "pool-info",
    title: "מידע על הבריכה",
    value: "ניתן לשלוט בתאורת הבריכה ממסך התאורה או ממסך המצבים.",
    description: "יש להשגיח על ילדים בקרבת המים בכל עת.",
  },
  {
    id: "check-in-out",
    title: "צ'ק אין / צ'ק אאוט",
    value: "צ'ק אין 15:00 | צ'ק אאוט 11:00",
    description: "לבקשות ליציאה מאוחרת, ניתן ליצור קשר ישירות עם המארח.",
  },
];
