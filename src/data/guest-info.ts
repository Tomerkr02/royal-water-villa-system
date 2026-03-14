import type { GuestInfoItem } from "@/types/models";

export const guestInfoSeed: GuestInfoItem[] = [
  {
    id: "wifi",
    title: "רשת Wi-Fi",
    description: "לגלישה מהירה ויציבה בכל אזורי הווילה.",
    entries: [
      {
        label: "רשת",
        value: "RoyalWaterVilla",
      },
      {
        label: "סיסמה",
        value: "123456789",
      },
    ],
  },
  {
    id: "house-rules",
    title: "כללי המקום",
    value: "נשמח אם תשמרו על אווירה נעימה במתחם.",
    bulletPoints: [
      "אין לשים מוזיקה בווליום גבוה",
      "אין לקפוץ לבריכה",
      "יש להשגיח על ילדים בקרבת הבריכה",
      "יש לשמור על הציוד והמתקנים במתחם",
    ],
  },
  {
    id: "check-in-out",
    title: "שעות כניסה ויציאה",
    description: "לבקשות מיוחדות ניתן ליצור קשר.",
    entries: [
      {
        label: "צ'ק אין",
        value: "15:00",
      },
      {
        label: "צ'ק אאוט",
        value: "10:00",
      },
    ],
  },
  {
    id: "villa-control",
    title: "שליטה במתחם",
    value: "באמצעות הטאבלט ניתן לשלוט בתאורה במתחם ולהפעיל מצבים שונים לנוחותכם.",
    emphasis: "שליטה פשוטה, מהירה ונוחה לאורך כל השהייה.",
  },
];
