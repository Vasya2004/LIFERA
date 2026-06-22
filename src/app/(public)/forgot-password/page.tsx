"use client";

import { useState } from "react";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { mapAuthErrorMessage } from "@/lib/auth/messages";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    if (loading) return;

    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const email = String(formData.get("email") ?? "").trim();

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(mapAuthErrorMessage(resetError.message));
        return;
      }

      setInfo("Письмо с ссылкой для сброса пароля отправлено. Проверьте почту.");
    } catch (err) {
      setError(
        err instanceof Error
          ? mapAuthErrorMessage(err.message)
          : "Не удалось отправить письмо. Попробуйте ещё раз.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell mode="login">
      <form action={handleSubmit} className="auth-form">
        <p className="auth-subtitle mb-4">
          Введите email, и мы отправим ссылку для восстановления пароля.
        </p>

        <label className="auth-field">
          <span className="auth-field-label">Email</span>
          <input
            autoComplete="email"
            className="auth-field-input"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </label>

        {error ? (
          <p className="auth-alert-error" role="alert">{error}</p>
        ) : null}
        {info ? (
          <p className="auth-alert-info" role="status">{info}</p>
        ) : null}

        <button
          aria-busy={loading}
          className="auth-submit"
          disabled={loading}
          type="submit"
        >
          <span className="auth-submit-inner">
            {loading ? <span aria-hidden className="auth-spinner" /> : null}
            <span>{loading ? "Отправляем…" : "Отправить ссылку"}</span>
          </span>
        </button>
      </form>

      <p className="auth-footer-link">
        <Link href="/login">Вернуться ко входу</Link>
      </p>
    </AuthShell>
  );
}
