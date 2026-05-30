import type { Metadata } from "next";
import "./globals.css";

const siteDescription =
  "Персональная Life RPG-система: цели, челленджи, привычки, XP, прогресс и AI-рекомендации.";

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
    icon: "/brand/lifera-mark.svg",
    shortcut: "/brand/lifera-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
