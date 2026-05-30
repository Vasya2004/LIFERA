import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-[var(--landing-border)] px-4 py-10 text-center text-xs text-[var(--landing-text-muted)] sm:px-6">
      <div className="landing-container">
        <p>Lifera — Life RPG command center</p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
          <Link className="transition-colors hover:text-[var(--landing-text-secondary)]" href="/pricing">
            Тарифы
          </Link>
          <Link className="transition-colors hover:text-[var(--landing-text-secondary)]" href="/login">
            Войти
          </Link>
          <Link className="transition-colors hover:text-[var(--landing-text-secondary)]" href="/privacy">
            Privacy
          </Link>
          <Link className="transition-colors hover:text-[var(--landing-text-secondary)]" href="/terms">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
