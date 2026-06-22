"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 30000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Lifera"
            className="h-12 w-12 flex-shrink-0 rounded-xl"
            src="/icons/icon-72x72.png"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">Установить Lifera</p>
            <p className="mt-0.5 text-xs text-zinc-400">
              Добавьте на главный экран для быстрого доступа
            </p>
          </div>
          <button
            className="flex-shrink-0 text-zinc-500 hover:text-zinc-300"
            onClick={() => setShowBanner(false)}
            type="button"
          >
            <X size={16} />
          </button>
        </div>
        <button
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          onClick={handleInstall}
          type="button"
        >
          <Download size={16} />
          Установить приложение
        </button>
      </div>
    </div>
  );
}
