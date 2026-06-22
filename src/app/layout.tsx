import type { Metadata, Viewport } from "next";

import { PWAInstallBanner } from "@/components/pwa-install-banner";
import { PWARegister } from "@/components/pwa-register";
import { ToastProvider } from "@/components/ui/toast-provider";
import "./globals.css";

const siteDescription =
  "Персональная Life RPG-система: цели, привычки, навыки, XP, прогресс и AI-рекомендации.";

export const metadata: Metadata = {
  title: {
    default: "Lifera — Life RPG для целей и прогресса",
    template: "%s · Lifera",
  },
  description: siteDescription,
  applicationName: "Lifera",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  openGraph: {
    title: "Lifera",
    description: siteDescription,
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Lifera",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icons/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png?v=2", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icons/favicon.svg?v=2",
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lifera",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#FF5A1F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark h-full">
      <head>
        <meta content="yes" name="mobile-web-app-capable" />
        <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg?v=2" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
      </head>
      <body className="min-h-full">
        <ToastProvider>
          {children}
          <PWARegister />
          <PWAInstallBanner />
        </ToastProvider>
      </body>
    </html>
  );
}
