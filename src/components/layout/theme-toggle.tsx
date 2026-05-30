"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type Theme = "system" | "light" | "dark";

const nextTheme: Record<Theme, Theme> = {
  dark: "system",
  light: "dark",
  system: "light",
};

const labels: Record<Theme, string> = {
  dark: "Темная тема",
  light: "Светлая тема",
  system: "Системная тема",
};

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  }
  localStorage.setItem("lifera-theme", theme);
}

export function ThemeToggle({ initialTheme }: { initialTheme: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    applyTheme(initialTheme);
  }, [initialTheme]);

  async function toggleTheme() {
    const value = nextTheme[theme];
    setTheme(value);
    applyTheme(value);

    await fetch("/api/me", {
      body: JSON.stringify({ preferred_theme: value }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    }).catch(() => null);
  }

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <Button
      aria-label={labels[theme]}
      onClick={toggleTheme}
      size="sm"
      title={labels[theme]}
      variant="secondary"
    >
      <Icon aria-hidden="true" size={16} />
    </Button>
  );
}
