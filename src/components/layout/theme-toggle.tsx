"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "system" | "light" | "dark";

const labels: Record<Theme, string> = {
  dark: "Темная тема",
  light: "Светлая тема",
  system: "Системная тема",
};

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const isDark = theme === "dark" || (theme === "system" && media.matches);

  root.dataset.theme = theme === "system" ? "" : theme;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  }

  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  localStorage.setItem("lifera-theme", theme);
}

export function ThemeToggle({ initialTheme }: { initialTheme: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    applyTheme(initialTheme);
  }, [initialTheme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => {
      setSystemDark(media.matches);
      if (theme === "system") {
        applyTheme("system");
      }
    };
    updateSystemTheme();
    media.addEventListener("change", updateSystemTheme);
    return () => media.removeEventListener("change", updateSystemTheme);
  }, [theme]);

  async function toggleTheme() {
    const value: Theme = (theme === "system" ? systemDark : theme === "dark") ? "light" : "dark";
    setTheme(value);
    applyTheme(value);

    await fetch("/api/me", {
      body: JSON.stringify({ preferred_theme: value }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    }).catch(() => null);
  }

  const isDark = theme === "system" ? systemDark : theme === "dark";

  return (
    <button
      aria-label={labels[theme]}
      className="relative inline-grid h-[54px] w-[104px] grid-cols-2 items-center rounded-full border border-border bg-surface-muted/70 p-1 text-muted-foreground shadow-[var(--shadow-sm)] backdrop-blur-xl transition-colors hover:border-border-strong"
      onClick={toggleTheme}
      title={labels[theme]}
      type="button"
    >
      <span
        aria-hidden="true"
        className={[
          "absolute left-1 top-1 h-11 w-11 rounded-full bg-foreground shadow-[var(--shadow-sm)] transition-transform duration-200",
          isDark ? "translate-x-[50px]" : "translate-x-0",
        ].join(" ")}
      />
      <span
        className={[
          "relative z-10 flex h-11 w-11 items-center justify-center rounded-full transition-colors",
          isDark ? "text-muted-foreground" : "text-background",
        ].join(" ")}
      >
        <Sun aria-hidden="true" size={17} strokeWidth={2.15} />
      </span>
      <span
        className={[
          "relative z-10 flex h-11 w-11 items-center justify-center rounded-full transition-colors",
          isDark ? "text-background" : "text-muted-foreground",
        ].join(" ")}
      >
        <Moon aria-hidden="true" size={17} strokeWidth={2.15} />
      </span>
    </button>
  );
}
