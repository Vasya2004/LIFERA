"use client";

import { useEffect, useState } from "react";

const PREF_KEY = "vaultera-theme-pref";

export type ThemePref = "auto" | "light" | "dark";
export type EffectiveTheme = "light" | "dark";

function systemTheme(): EffectiveTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Предпочтение пользователя (по умолчанию — следовать теме устройства). */
export function useVaulteraTheme() {
  const [pref, setPrefState] = useState<ThemePref>("auto");
  const [system, setSystem] = useState<EffectiveTheme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem(PREF_KEY);
    if (saved === "light" || saved === "dark" || saved === "auto") setPrefState(saved);
    setSystem(systemTheme());

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSystem(e.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function setPref(next: ThemePref) {
    setPrefState(next);
    localStorage.setItem(PREF_KEY, next);
  }

  const effectiveTheme: EffectiveTheme = pref === "auto" ? system : pref;

  return { pref, setPref, effectiveTheme };
}
