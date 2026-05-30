import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { AuthLavaBackground } from "@/components/auth/auth-lava-background";
import "./auth.css";

type AuthShellProps = {
  children: ReactNode;
  mode: "login" | "register";
};

const cardCopy = {
  login: {
    badge: "Доступ к Lifera",
    divider: "Вход по email",
    subtitle: "Вернись в свой центр личного прогресса.",
    title: "Войти в Lifera",
  },
  register: {
    badge: "Доступ к Lifera",
    divider: "Вход по email",
    subtitle: "Запусти систему целей, челленджей, привычек и прогресса.",
    title: "Создать аккаунт",
  },
};

const decorativeCopy = {
  login: {
    bottomLeft: "СИСТЕМА ПРОГРЕССА ГОТОВА",
  },
  register: {
    bottomLeft: "НАЧНИ С ОДНОЙ ЦЕЛИ",
  },
};

const sharedDecorative = {
  topLeft: "LIFERA // СИСТЕМА ПРОГРЕССА",
  vertical: "ЦЕЛИ // ПРОГРЕСС // AI",
};

export function AuthShell({ children, mode }: AuthShellProps) {
  const content = cardCopy[mode];
  const decorative = decorativeCopy[mode];

  return (
    <div className="auth-page">
      <AuthLavaBackground />

      <div className="auth-page-frame">
        <div className="auth-brand-block">
          <span className="auth-microcopy auth-microcopy-top-left">
            {sharedDecorative.topLeft}
          </span>
          <Link className="auth-brand" href="/">
            <Image
              alt=""
              className="h-5 w-auto invert"
              height={157}
              src="/brand/lifera-mark.svg"
              width={105}
            />
            Lifera
          </Link>
        </div>

        <span className="auth-microcopy auth-microcopy-bottom-left">
          {decorative.bottomLeft}
        </span>

        <div className="auth-microcopy auth-microcopy-top-right">
          <span className="auth-pill-muted">v0.1</span>
          <span className="auth-pill-muted">MVP</span>
        </div>

        <span className="auth-microcopy auth-microcopy-vertical">
          {sharedDecorative.vertical}
        </span>

        <div className="auth-grid">
          <div aria-hidden className="auth-visual-zone" />
          <div className="auth-page-layout">
            <div className="auth-card">
              <div className="auth-header-group">
                <span className="auth-badge">{content.badge}</span>
                <h1 className="auth-title">{content.title}</h1>
                <p className="auth-subtitle">{content.subtitle}</p>
              </div>

              <div className="auth-divider">
                <span>{content.divider}</span>
              </div>

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
