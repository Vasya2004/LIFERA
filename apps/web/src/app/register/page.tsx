"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (!data.session) {
      setPendingConfirmation(true);
      return;
    }
    router.push("/areas");
    router.refresh();
  }

  if (pendingConfirmation) {
    return (
      <AuthShell mode="register">
        <p className="auth-alert-info" role="status">
          Мы отправили письмо со ссылкой для подтверждения на {email}. Перейдите
          по ссылке из письма, чтобы завершить регистрацию.
        </p>
        <p className="auth-footer-link">
          <Link href="/login">Войти</Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell mode="register">
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
            placeholder="Минимум 6 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
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
            <span>{loading ? "Создаём аккаунт…" : "Создать аккаунт"}</span>
          </span>
        </button>
      </form>

      <p className="auth-footer-link">
        Уже есть аккаунт? <Link href="/login">Войти</Link>
      </p>
    </AuthShell>
  );
}
