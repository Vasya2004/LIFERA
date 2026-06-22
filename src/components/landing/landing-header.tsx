import Image from "next/image";
import Link from "next/link";

export function LandingHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="landing-glass flex h-14 items-center justify-between gap-3 rounded-full border-white/10 bg-black/35 px-3 shadow-[0_18px_55px_rgb(0_0_0/0.24)] backdrop-blur-xl sm:px-4 lg:grid lg:h-14 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:px-3">
          <Link className="flex items-center gap-2.5 justify-self-start" href="/">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[var(--landing-surface-elevated)]">
              <Image
                alt=""
                className="h-5 w-auto invert"
                height={157}
                src="/brand/lifera-mark.svg"
                width={105}
              />
            </span>
            <Image
              alt="Lifera"
              className="hidden h-4 w-auto invert sm:block"
              height={145}
              src="/brand/lifera-wordmark.svg"
              width={661}
            />
          </Link>

          <nav
            aria-label="Основная навигация"
            className="hidden items-center justify-center gap-6 text-sm font-medium text-[var(--landing-text-secondary)] lg:flex lg:justify-self-center"
          >
            <a className="transition-colors hover:text-[var(--landing-text)]" href="#features">
              Возможности
            </a>
            <a className="transition-colors hover:text-[var(--landing-text)]" href="#how-it-works">
              Как работает
            </a>
            <a className="transition-colors hover:text-[var(--landing-text)]" href="#pricing">
              Тарифы
            </a>
            <a className="transition-colors hover:text-[var(--landing-text)]" href="#faq">
              FAQ
            </a>
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-3 lg:justify-self-end">
            <Link
              className="hidden text-sm font-semibold text-[var(--landing-text-secondary)] transition-colors hover:text-[var(--landing-text)] sm:inline-flex"
              href="/login"
            >
              Войти
            </Link>
            <Link
              className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full bg-[var(--landing-accent)] px-3 text-[11px] font-semibold text-white shadow-[0_10px_28px_rgb(255_90_31/0.22)] transition-colors hover:bg-[#E94F18] sm:h-10 sm:px-4 sm:text-sm"
              href="/register"
            >
              Начать бесплатно
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
