"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { mapAuthErrorMessage } from "@/lib/auth/messages";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
  }, []);

  async function handleSubmit(formData: FormData) {
    if (loading) return;

    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const password = String(formData.get("password") ?? "");
      const confirmation = String(formData.get("password_confirmation") ?? "");

      if (password !== confirmation) {
        setError("Пароли не совпадают.");
        setLoading(false);
        return;
      }

      if (password.length < 8) {
        setError("Пароль должен содержать минимум 8 символов.");
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(mapAuthErrorMessage(updateError.message));
        return;
      }

      setInfo("Пароль обновлён. Через несколько секунд вы будете перенаправлены.");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? mapAuthErrorMessage(err.message)
          : "Не удалось обновить пароль. Попробуйте ещё раз.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell mode="login">
      <form action={handleSubmit} className="auth-form">
        <p className="auth-subtitle mb-4">
          Введите новый пароль для вашего аккаунта.
        </p>

        <label className="auth-field">
          <span className="auth-field-label">Новый пароль</span>
          <input
            autoComplete="new-password"
            className="auth-field-input"
            minLength={8}
            name="password"
            placeholder="Минимум 8 символов"
            required
            type="password"
          />
        </label>

        <label className="auth-field">
          <span className="auth-field-label">Повторите пароль</span>
          <input
            autoComplete="new-password"
            className="auth-field-input"
            minLength={8}
            name="password_confirmation"
            placeholder="Повторите пароль"
            required
            type="password"
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
          disabled={loading || !ready}
          type="submit"
        >
          <span className="auth-submit-inner">
            {loading ? <span aria-hidden className="auth-spinner" /> : null}
            <span>{loading ? "Сохраняем…" : "Сохранить пароль"}</span>
          </span>
        </button>
      </form>

      <p className="auth-footer-link">
        <Link href="/login">Вернуться ко входу</Link>
      </p>
    </AuthShell>
  );
}
