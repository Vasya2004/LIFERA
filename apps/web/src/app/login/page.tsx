"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/areas");
    router.refresh();
  }

  return (
    <AuthShell mode="login">
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-field">
          <span className="auth-field-label">Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="auth-field-input"
          />
        </label>

        <label className="auth-field">
          <span className="auth-field-label">Пароль</span>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="auth-field-input"
          />
        </label>

        {error && (
          <p className="auth-alert-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="auth-submit">
          <span className="auth-submit-inner">
            {loading ? <span aria-hidden className="auth-spinner" /> : null}
            <span>{loading ? "Входим…" : "Войти"}</span>
          </span>
        </button>
      </form>

      <p className="auth-footer-link">
        Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
      </p>
    </AuthShell>
  );
}
