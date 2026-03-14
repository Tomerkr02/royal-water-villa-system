import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import "./globals.css";
import { PwaRegistrar } from "@/components/pwa/pwa-registrar";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

const frankRuhl = Frank_Ruhl_Libre({
  variable: "--font-frank-ruhl",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#070b14",
};

export const metadata: Metadata = {
  title: "Royal Water Villa Control",
  description:
    "מערכת טאבלט יוקרתית לאורחי Royal Water Villa, עם חוויית אירוח פרימיום ומבנה מוכן לחיבור Tuya.",
  applicationName: "Royal Water Villa Control",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Royal Water Villa Control",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`${heebo.variable} ${frankRuhl.variable} antialiased`}>
        <PwaRegistrar />
        {children}
      </body>
    </html>
  );
}
