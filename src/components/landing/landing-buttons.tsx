import type { ReactNode } from "react";
import Link from "next/link";

export function PrimaryButton({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <Link className="landing-btn-primary" href={href}>
      {children}
    </Link>
  );
}

export function SecondaryButton({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <Link className="landing-btn-secondary" href={href}>
      {children}
    </Link>
  );
}
