# Royal Water Villa Control

מערכת טאבלט יוקרתית לאורחי `Royal Water Villa`, שנבנתה כתחליף פרימיום ל-`Smart Life / Tuya` עבור מסך שליטה מרכזי בטאבלט אנדרואיד.

## טכנולוגיה

- `Next.js` App Router
- `React` + `TypeScript` strict mode
- `Tailwind CSS v4`
- `Framer Motion`
- `lucide-react`
- `Zustand`

## מה קיים כרגע

- ממשק יוקרתי בעברית מלאה עם `RTL`
- התאמה לטאבלט אנדרואיד במצב אופקי
- מסכים פעילים:
  - ראשי
  - תאורה
  - מצבים
  - מידע לאורח
  - יצירת קשר
- `Splash screen`
- `Toast notifications`
- חלון אישור לפני כיבוי כל התאורות
- `Mock provider` עם התנהגות אסינכרונית מדומה
- שלד `Tuya provider` לשלב הבא
- `PWA` אמיתי עם `manifest`, אייקונים, `service worker` ורישום אוטומטי

## הרצה מקומית

```bash
npm install
npm run dev
```

לאחר מכן לפתוח את [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## עריכת תוכן

רוב התוכן נשלט דרך קבצי קונפיגורציה ולא דרך רכיבי UI.

- מכשירים: [src/data/devices.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/data/devices.ts)
- מצבים: [src/data/scenes.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/data/scenes.ts)
- מידע לאורח: [src/data/guest-info.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/data/guest-info.ts)
- פעולות יצירת קשר: [src/data/contact-actions.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/data/contact-actions.ts)

## ארכיטקטורה

המבנה מחולק לשכבות ברורות:

- `src/components`
  - רכיבי UI ורכיבי מסכים
- `src/data`
  - תוכן דמו וקונפיגורציה התחלתית
- `src/store`
  - ניהול מצב אפליקטיבי ו-feedback למשתמש
- `src/services`
  - שכבת גישה למכשירים ולמצבים לפי provider
- `src/types`
  - חוזי TypeScript משותפים

### שכבת providers

ה-UI לא מחובר ישירות ל-mock data:

- [src/services/device-service.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/services/device-service.ts)
- [src/services/scene-service.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/services/scene-service.ts)
- [src/services/providers/mock-provider.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/services/providers/mock-provider.ts)
- [src/services/providers/tuya-provider.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/services/providers/tuya-provider.ts)

כך ניתן להחליף provider בעתיד בלי לשבור את שכבת התצוגה.

## איפה מחברים Tuya בהמשך

נקודת החיבור הראשית:

- [src/services/providers/tuya-provider.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/services/providers/tuya-provider.ts)
- [src/lib/server/tuya-client.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/lib/server/tuya-client.ts)
- [src/config/tuya-device-mapping.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/config/tuya-device-mapping.ts)

מסלול מומלץ לשלב הבא:

1. לממש `getDevices()` על בסיס מיפוי payloads של Tuya אל הטיפוס המקומי `Device`.
2. לממש `setDeviceState()` באמצעות פקודות Tuya עבור כל התקן.
3. לממש `turnOffAll()` כ-batch commands או כ-scene בצד Tuya.
4. לממש `activateScene()` דרך תרגום של scene definitions לפקודות אמיתיות.
5. להחליף את ה-provider הנבחר ב:
   - [src/services/device-service.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/services/device-service.ts)
   - [src/services/scene-service.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/services/scene-service.ts)

## Tuya relay integration

האינטגרציה בנויה עבור ממסרי `Wi-Fi relay` בקופסאות חשמל, ולא עבור נורות חכמות.

### מה נוסף

- מצב `discovery/debug` לקריאת התקנים מ-Tuya
- הדפסה בטוחה ל-console של:
  - `id`
  - `name`
  - `category`
  - `status`
  - `functions`
- שכבת mapping מקומית שמאפשרת למפות כל רכיב UI אל:
  - התקן Tuya מלא
  - או ערוץ ספציפי כמו `switch_1`, `switch_2`, `switch_3`
- `command code` נפרד לכל רכיב, בלי הנחה שכל ההתקנים עובדים באותו קוד

### קבצים חשובים

- מיפוי התקנים: [src/config/tuya-device-mapping.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/config/tuya-device-mapping.ts)
- discovery API: [src/app/api/tuya/discovery/route.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/app/api/tuya/discovery/route.ts)
- מצב מקומי מסונכרן מ-Tuya: [src/app/api/tuya/local-devices/route.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/app/api/tuya/local-devices/route.ts)
- שליחת פקודה חיה: [src/app/api/tuya/command/route.ts](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/app/api/tuya/command/route.ts)
- מסך פיתוח זמני: [src/app/developer/tuya/page.tsx](/C:/Users/USER/Desktop/RoyalWaterVilla_System/src/app/developer/tuya/page.tsx)

### משתני סביבה

דוגמה מלאה נמצאת ב-[.env.example](/C:/Users/USER/Desktop/RoyalWaterVilla_System/.env.example).

העיקריים:

- `NEXT_PUBLIC_DEVICE_PROVIDER=mock|tuya`
- `TUYA_ACCESS_ID`
- `TUYA_ACCESS_SECRET`
- `TUYA_API_BASE_URL`
- `TUYA_DISCOVERY_STRATEGY=project|device_ids`
- `TUYA_DISCOVERY_DEVICE_IDS`

### תהליך עבודה בטוח

1. להשאיר `NEXT_PUBLIC_DEVICE_PROVIDER=mock`.
2. להגדיר credentials של Tuya.
3. לפתוח את מסך הפיתוח:
   - `/developer/tuya`
4. לבדוק אילו התקנים התגלו ואילו `command codes` קיימים בפועל.
5. לעדכן את קובץ ה-mapping.
6. רק לאחר אימות, לשנות ל-`NEXT_PUBLIC_DEVICE_PROVIDER=tuya`.

## PWA ואנדרואיד

בגרסה הנוכחית המערכת כוללת:

- `manifest`
- אייקוני אפליקציה
- `service worker`
- מצב `fullscreen`
- חוויית מסך מותאמת טאבלט

### שלב ראשון מומלץ

להריץ כ-Web App מותקן על טאבלט Android:

1. לפרוס את המערכת לכתובת קבועה.
2. לפתוח אותה ב-Chrome בטאבלט.
3. לבחור `Add to Home Screen` / התקנה.
4. להפעיל את האפליקציה במצב מסך מלא.
5. לנעול את הטאבלט עם כלי `kiosk`.

כלים פרקטיים לשלב הראשון:

- `Fully Kiosk Browser`
- `SureLock`
- Android `Screen Pinning`

### שלב מתקדם

לעטוף את אותו פרויקט ב-shell ייעודי:

- `Capacitor`
- או אפליקציית `WebView` מותאמת kiosk

כך מקבלים:

- שליטה טובה יותר בהפעלה אוטומטית
- נעילה חזקה יותר של המכשיר
- הכנה להרשאות native בהמשך

## החלטות UX

- עברית מלאה עם `RTL` מדויק
- שפת עיצוב כהה, יוקרתית וממותגת לווילה
- כפתורים גדולים ואזורי לחיצה נוחים
- אנימציות עדינות כדי לשמור על תחושת פרימיום בלי להכביד על סוללה
- מסך אופקי כיעד מרכזי, בלי לשבור שימוש אנכי

## הערות

- ברירת המחדל כרגע היא `mock provider`.
- לא נוסף backend בשלב הזה.
- המבנה מוכן להתרחבות למוצר רב-נכסי בעתיד.
