'use client';

/** Vertical/section spacing only — horizontal padding lives in AppShell (Influera pattern). */
export default function PageContainer({ children, className = '' }) {
  return <div className={`min-w-0 w-full ${className}`}>{children}</div>;
}
