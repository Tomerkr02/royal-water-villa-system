"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "he" | "en";

type TranslationLeaf = string | string[] | Record<string, unknown>;

interface I18nContextValue {
  language: Language;
  dir: "rtl" | "ltr";
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  getObject: <T>(key: string) => T;
}

export const LANGUAGE_STORAGE_KEY = "royal-water-villa-language";
export const DEFAULT_LANGUAGE: Language = "he";

const translations = {
  he: {
    language: {
      label: "שפה",
      he: "עברית",
      en: "English",
    },
    common: {
      brand: "Royal Water Villa",
      quickAccess: "גישה מהירה",
      ready: "מוכן",
      syncing: "מסנכרן",
      actionConfirmation: "אישור פעולה",
      cancel: "ביטול",
      premium: "Premium",
      activeState: "דלוק",
      inactiveState: "כבוי",
      tapToTurnOn: "לחיצה להפעלה",
      tapToTurnOff: "לחיצה לכיבוי",
      state: "מצב",
      activeLighting: "תאורה פעילה",
      activeAreas: "אזורים דלוקים כרגע",
      experience: "חוויית הפעלה",
      tabletOptimized: "מותאם לטאבלט אורחים אופקי",
      loadingErrorTitle: "שגיאת טעינה",
      loadingErrorMessage: "לא ניתן היה לטעון את מצב המערכת.",
      commandSentTitle: "הפקודה נשלחה",
      commandSentMessage: "הפעולה בוצעה בהצלחה.",
      commandFailedTitle: "הפקודה נכשלה",
      commandFailedMessage: "נכשלה שליחת הפקודה להתקן.",
      sceneActivatedTitle: "המצב הופעל",
      sceneActivatedMessage: "המצב הופעל בהצלחה.",
      sceneErrorTitle: "שגיאת מצב",
      sceneErrorMessage: "נכשלה הפעלת המצב.",
      allOffTitle: "כל התאורות כובו",
      allOffMessage: "כל אזורי התאורה כובו בהצלחה.",
      allOffErrorTitle: "שגיאת כיבוי",
      allOffErrorMessage: "נכשל כיבוי כלל התאורות.",
    },
    nav: {
      home: "ראשי",
      lighting: "תאורה",
      scenes: "מצבים",
      guest: "מידע לאורחים",
    },
    dashboard: {
      title: "לוח בקרה לאורחים",
      description:
        "מערכת אירוח שקטה, מהירה ויוקרתית, שנבנתה במיוחד כדי להרגיש כמו חלק טבעי מהשהייה ב־\u2068Royal Water Villa\u2069.",
      allLightsOffLabel: "כיבוי כל התאורות",
      allLightsOffDescription: "כיבוי מלא ואלגנטי של כל אזורי התאורה בווילה.",
      fullShutdownLabel: "כיבוי מלא",
      fullShutdownDescription: "כיבוי מיידי של כל התאורות בלחיצה אחת.",
      confirmAllOffTitle: "לכבות את כל התאורות?",
      confirmAllOffDescription: "הפעולה תכבה את כל אזורי התאורה הפעילים ברחבי הווילה.",
      confirmAllOffButton: "כן, לכבות הכל",
    },
    splash: {
      title: "Control",
      subtitle: "חוויית אירוח יוקרתית",
    },
    time: {
      welcome: "ברוכים הבאים לחוויית האירוח שלכם",
    },
    home: {
      eyebrow: "קבלת פנים",
      title: "ברוכים הבאים ל־\u2068Royal Water Villa\u2069",
      description:
        "ממשק האירוח של הווילה נבנה כדי להרגיש טבעי, יוקרתי ונעים. התאורה, המצבים והמידע החשוב זמינים כאן במסך אחד נקי ומהיר במיוחד.",
      lightingTitle: "תאורה",
      lightingDescription: "שליטה מהירה בכל אזורי התאורה עם כרטיסים גדולים ונוחים למגע.",
      scenesTitle: "מצבים",
      scenesDescription: "הפעלת אווירה מוכנה מראש כמו ערב, רומנטי, בריכה או לילה.",
      guestTitle: "מידע לאורחים",
      guestDescription: "Wi-Fi, שעות שהייה, כללי המקום והנחיות שימוש חשובות.",
      villaStatusLabel: "מצב הווילה",
      villaStatusTitle: "הכל מוכן לאירוח",
      villaStatusDescription:
        "כרגע פועלים {activeCount} אזורי תאורה. אפשר להמשיך לשליטה ידנית או לבחור מצב מוכן מראש ליצירת אווירה בלחיצה אחת.",
      allLightsOffLabel: "כיבוי כל התאורות",
      allLightsOffDescription: "מומלץ לפני יציאה מהווילה או בסיום השהייה.",
    },
    lighting: {
      eyebrow: "תאורה",
      title: "שליטה חכמה בתאורת הווילה",
      description:
        "כרטיסים גדולים, חיווי ברור של מצב דלוק או כבוי, ונוחות לחיצה שתוכננה במיוחד לטאבלט אנדרואיד במסך אופקי.",
    },
    scenes: {
      eyebrow: "מצבים",
      title: "אווירה מוכנה בלחיצה אחת",
      description:
        "אוסף מצבים שנבנו כדי להתאים לרגעים שונים בשהייה: הגעה, ערב, אירוח ליד הבריכה, לילה רגוע או יציאה מהווילה.",
    },
    guest: {
      eyebrow: "מידע לאורחים",
      title: "ברוכים הבאים ל־\u2068Royal Water Villa\u2069",
      description: "כאן תמצאו מידע חשוב שיעזור לכם ליהנות משהייה נעימה ונוחה במתחם.",
      wifi: {
        title: "רשת Wi-Fi",
        description: "לגלישה מהירה ויציבה בכל אזורי הווילה.",
        entries: [
          { label: "רשת", value: "RoyalWaterVilla" },
          { label: "סיסמה", value: "123456789" },
        ],
      },
      "house-rules": {
        title: "כללי המקום",
        value: "נשמח אם תשמרו על אווירה נעימה במתחם.",
        bulletPoints: [
          "אין לשים מוזיקה בווליום גבוה",
          "אין לקפוץ לבריכה",
          "יש להשגיח על ילדים בקרבת הבריכה",
          "יש לשמור על הציוד והמתקנים במתחם",
        ],
      },
      "check-in-out": {
        title: "שעות כניסה ויציאה",
        description: "לבקשות מיוחדות ניתן ליצור קשר.",
        entries: [
          { label: "צ'ק אין", value: "15:00" },
          { label: "צ'ק אאוט", value: "10:00" },
        ],
      },
      "villa-control": {
        title: "שליטה במתחם",
        value: "באמצעות הטאבלט ניתן לשלוט בתאורה במתחם ולהפעיל מצבים שונים לנוחותכם.",
        emphasis: "שליטה פשוטה, מהירה ונוחה לאורך כל השהייה.",
      },
    },
    devices: {
      wallLight: {
        name: "תאורת חומה",
        description: "ממסר לתאורת החומה של הווילה.",
        location: "חוץ",
      },
      pergolaLight: {
        name: "תאורת פרגולה",
        description: "ממסר לתאורת אזור הפרגולה והישיבה.",
        location: "פרגולה",
      },
      livingRoomLedWall: {
        name: "קיר לד סלון",
        description: "ממסר לערוץ קיר הלד באזור הסלון.",
        location: "סלון",
      },
      livingRoomCeilingSpots: {
        name: "ספוטים תקרה סלון",
        description: "ממסר לספוטים בתקרת הסלון.",
        location: "סלון",
      },
      barLight: {
        name: "תאורת בר",
        description: "ממסר ייעודי לתאורת הבר.",
        location: "בר",
      },
      poolLight: {
        name: "תאורת בריכה",
        description: "ממסר לתאורת הבריכה.",
        location: "בריכה",
      },
      rearPathLight: {
        name: "תאורת שביל אחורי",
        description: "ממסר לתאורת השביל האחורי.",
        location: "שביל",
      },
      outdoorWallLight: {
        name: "תאורת קיר חוץ",
        description: "ממסר לתאורת קיר החוץ.",
        location: "קיר חוץ",
      },
      bathroomLight: {
        name: "תאורת אמבטיה",
        description: "ממסר לתאורת האמבטיה.",
        location: "אמבטיה",
      },
      ceilingFan: {
        name: "מאוורר תקרה",
        description: "שליטה פשוטה במאוורר התקרה של הווילה.",
        location: "חלל מרכזי",
      },
      ceilingFanLight: {
        name: "תאורת מאוורר",
        description: "הדלקה וכיבוי של תאורת המאוורר.",
        location: "חלל מרכזי",
      },
      bathroomHeater: {
        name: "חימום מקלחת",
        description: "הפעלה מהירה של גוף החימום באזור המקלחת.",
        location: "מקלחת",
      },
    },
    scenesData: {
      "evening-mode": {
        name: "מצב ערב",
        description: "תאורת ערב מזמינה שמכינה את הווילה לרוגע ונוכחות.",
        mood: "איזון בין חמימות, נראות ותחושת אירוח",
      },
      "romantic-mode": {
        name: "מצב רומנטי",
        description: "תאורה רכה ומדויקת לערב אינטימי עם אווירה שקטה.",
        mood: "אלגנטיות עמומה עם נוכחות עדינה",
      },
      "pool-mode": {
        name: "מצב בריכה",
        description: "מדגיש את אזור הבריכה והחוץ לאירוח לילי מרשים.",
        mood: "כחול, פתוח ומזמין",
      },
      "night-mode": {
        name: "מצב לילה",
        description: "משאיר רק אור רך ונעים לשעות הלילה המאוחרות.",
        mood: "שקט, מינימלי ומרגיע",
      },
      "away-mode": {
        name: "מצב יציאה",
        description: "מכבה את כלל התאורות לפני יציאה מהווילה.",
        mood: "כיבוי מלא, מסודר ובטוח",
      },
      "villa-glow": {
        name: "זוהר הווילה",
        description: "מראה חתימה יוקרתי שמציג את הווילה במלוא היופי שלה.",
        mood: "הצגה דרמטית עם תחושת פרימיום",
      },
    },
  },
  en: {
    language: {
      label: "Language",
      he: "עברית",
      en: "English",
    },
    common: {
      brand: "Royal Water Villa",
      quickAccess: "Quick access",
      ready: "Ready",
      syncing: "Syncing",
      actionConfirmation: "Confirm action",
      cancel: "Cancel",
      premium: "Premium",
      activeState: "On",
      inactiveState: "Off",
      tapToTurnOn: "Tap to turn on",
      tapToTurnOff: "Tap to turn off",
      state: "Status",
      activeLighting: "Active lighting",
      activeAreas: "Areas currently on",
      experience: "Guest experience",
      tabletOptimized: "Optimized for a landscape guest tablet",
      loadingErrorTitle: "Loading error",
      loadingErrorMessage: "The system status could not be loaded.",
      commandSentTitle: "Command sent",
      commandSentMessage: "The action was completed successfully.",
      commandFailedTitle: "Command failed",
      commandFailedMessage: "The device command could not be sent.",
      sceneActivatedTitle: "Scene activated",
      sceneActivatedMessage: "The selected scene is now active.",
      sceneErrorTitle: "Scene error",
      sceneErrorMessage: "The scene could not be activated.",
      allOffTitle: "All lights turned off",
      allOffMessage: "All lighting zones have been turned off successfully.",
      allOffErrorTitle: "Shutdown error",
      allOffErrorMessage: "Failed to turn off all lighting zones.",
    },
    nav: {
      home: "Home",
      lighting: "Lighting",
      scenes: "Scenes",
      guest: "Guest Info",
    },
    dashboard: {
      title: "Guest Control Panel",
      description:
        "A calm, fast and refined guest interface designed to feel like a natural part of the Royal Water Villa stay.",
      allLightsOffLabel: "Turn off all lights",
      allLightsOffDescription: "A full, elegant shutdown of every lighting zone in the villa.",
      fullShutdownLabel: "Full shutdown",
      fullShutdownDescription: "Instantly turn off all lighting with a single tap.",
      confirmAllOffTitle: "Turn off all lights?",
      confirmAllOffDescription: "This will switch off every active lighting zone across the villa.",
      confirmAllOffButton: "Yes, turn everything off",
    },
    splash: {
      title: "Control",
      subtitle: "A premium guest experience",
    },
    time: {
      welcome: "Welcome to your villa experience",
    },
    home: {
      eyebrow: "Welcome",
      title: "Welcome to Royal Water Villa",
      description:
        "This guest interface was designed to feel natural, refined and effortless. Lighting, scenes and essential villa information are all available here in one clean, fast screen.",
      lightingTitle: "Lighting",
      lightingDescription: "Quick control of every lighting zone with large, touch-friendly cards.",
      scenesTitle: "Scenes",
      scenesDescription: "Start a ready-made atmosphere such as evening, romantic, pool or night mode.",
      guestTitle: "Guest Information",
      guestDescription: "Wi-Fi, stay details, house rules and helpful guidance for your visit.",
      villaStatusLabel: "Villa status",
      villaStatusTitle: "Everything is ready",
      villaStatusDescription:
        "{activeCount} lighting zones are currently on. Continue with manual control or choose a ready-made scene to create the perfect atmosphere in one tap.",
      allLightsOffLabel: "Turn off all lights",
      allLightsOffDescription: "Recommended before leaving the villa or at the end of your stay.",
    },
    lighting: {
      eyebrow: "Lighting",
      title: "Smart lighting control for the villa",
      description:
        "Large cards, clear on/off feedback, and comfortable tap areas designed especially for a landscape Android tablet.",
    },
    scenes: {
      eyebrow: "Scenes",
      title: "Instant atmosphere in one tap",
      description:
        "A curated set of scenes for different moments during your stay: arrival, evening, poolside hosting, quiet night, or leaving the villa.",
    },
    guest: {
      eyebrow: "Guest Information",
      title: "Welcome to Royal Water Villa",
      description: "Here you will find helpful information for a smooth, comfortable and enjoyable stay.",
      wifi: {
        title: "Wi-Fi Network",
        description: "Fast and stable internet coverage throughout the villa.",
        entries: [
          { label: "Network", value: "RoyalWaterVilla" },
          { label: "Password", value: "123456789" },
        ],
      },
      "house-rules": {
        title: "House Rules",
        value: "We kindly ask that you help us keep the villa calm, pleasant and well cared for.",
        bulletPoints: [
          "Please do not play music at high volume",
          "Do not jump into the pool",
          "Please supervise children near the pool",
          "Please take care of the villa equipment and facilities",
        ],
      },
      "check-in-out": {
        title: "Check-in & Check-out",
        description: "For special requests, please contact the host.",
        entries: [
          { label: "Check-in", value: "15:00" },
          { label: "Check-out", value: "10:00" },
        ],
      },
      "villa-control": {
        title: "Villa Control",
        value: "Use the tablet to control the villa lighting and activate preset scenes for your comfort.",
        emphasis: "Simple, fast and convenient control throughout your stay.",
      },
    },
    devices: {
      wallLight: {
        name: "Wall Light",
        description: "Relay control for the villa wall lighting.",
        location: "Outdoor",
      },
      pergolaLight: {
        name: "Pergola Light",
        description: "Relay control for the pergola and seating area.",
        location: "Pergola",
      },
      livingRoomLedWall: {
        name: "Living Room LED Wall",
        description: "Relay channel for the LED wall light in the living room.",
        location: "Living room",
      },
      livingRoomCeilingSpots: {
        name: "Living Room Ceiling Spots",
        description: "Relay channel for the living room ceiling spotlights.",
        location: "Living room",
      },
      barLight: {
        name: "Bar Light",
        description: "Dedicated relay for the bar lighting.",
        location: "Bar",
      },
      poolLight: {
        name: "Pool Light",
        description: "Relay control for the pool lighting.",
        location: "Pool",
      },
      rearPathLight: {
        name: "Rear Path Light",
        description: "Relay control for the rear pathway lighting.",
        location: "Pathway",
      },
      outdoorWallLight: {
        name: "Exterior Wall Light",
        description: "Relay control for the exterior wall light.",
        location: "Exterior wall",
      },
      bathroomLight: {
        name: "Bathroom Light",
        description: "Relay control for the bathroom light.",
        location: "Bathroom",
      },
      ceilingFan: {
        name: "Ceiling Fan",
        description: "Simple on/off control for the villa ceiling fan.",
        location: "Main area",
      },
      ceilingFanLight: {
        name: "Fan Light",
        description: "Turn the ceiling fan light on or off.",
        location: "Main area",
      },
      bathroomHeater: {
        name: "Bathroom Heater",
        description: "Quick on/off control for the bathroom heater.",
        location: "Bathroom",
      },
    },
    scenesData: {
      "evening-mode": {
        name: "Evening Mode",
        description: "Warm, welcoming evening lighting for a relaxed villa atmosphere.",
        mood: "Balanced warmth, visibility and hospitality",
      },
      "romantic-mode": {
        name: "Romantic Mode",
        description: "Soft, refined lighting for a quiet and intimate evening.",
        mood: "Subtle elegance with a gentle glow",
      },
      "pool-mode": {
        name: "Pool Mode",
        description: "Highlights the pool and outdoor areas for an impressive night setting.",
        mood: "Open, fresh and inviting",
      },
      "night-mode": {
        name: "Night Mode",
        description: "Leaves only a soft, comfortable glow for the late hours.",
        mood: "Quiet, minimal and calming",
      },
      "away-mode": {
        name: "Away Mode",
        description: "Turns off all lighting before leaving the villa.",
        mood: "Clean, safe and fully shut down",
      },
      "villa-glow": {
        name: "Villa Glow",
        description: "A signature presentation mode that showcases the villa at its best.",
        mood: "Dramatic presentation with premium character",
      },
    },
  },
} as const;

const I18nContext = createContext<I18nContextValue | null>(null);

function resolveTranslation(language: Language, key: string): TranslationLeaf {
  const segments = key.split(".");
  let current: TranslationLeaf = translations[language];

  for (const segment of segments) {
    if (!current || typeof current !== "object" || Array.isArray(current) || !(segment in current)) {
      throw new Error(`Missing translation key '${key}' for language '${language}'.`);
    }

    current = current[segment as keyof typeof current] as TranslationLeaf;
  }

  return current;
}

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === "en" ? "en" : DEFAULT_LANGUAGE;
}

export function getCurrentUiLanguage() {
  return getStoredLanguage();
}

export function getDirection(language: Language) {
  return language === "he" ? "rtl" : "ltr";
}

export function translate(language: Language, key: string) {
  const value = resolveTranslation(language, key);

  if (typeof value !== "string") {
    throw new Error(`Translation key '${key}' does not resolve to a string.`);
  }

  return value;
}

export function getTranslationObject<T>(language: Language, key: string) {
  return resolveTranslation(language, key) as T;
}

export function interpolate(template: string, variables: Record<string, string | number>) {
  return Object.entries(variables).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => getStoredLanguage());

  useEffect(() => {
    const dir = getDirection(language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      dir: getDirection(language),
      setLanguage: setLanguageState,
      t: (key: string) => translate(language, key),
      getObject: <T,>(key: string) => getTranslationObject<T>(language, key),
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider.");
  }

  return context;
}
