import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifeOS",
  description:
    "Персональная цифровая экосистема для управления целями, задачами, привычками и прогрессом.",
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
