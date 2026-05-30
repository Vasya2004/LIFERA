"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { mapAuthErrorMessage } from "@/lib/auth/messages";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthFormProps = {
  mode: "login" | "register";
};

async function resolvePostAuthPath(supabase: ReturnType<typeof createSupabaseBrowserClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "/login";
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("onboarding_completed")
    .eq("user_id", user.id)
    .maybeSingle();

  return profile?.onboarding_completed ? "/dashboard" : "/onboarding";
}

function AuthField({
  autoComplete,
  label,
  minLength,
  name,
  placeholder,
  required,
  type,
}: {
  autoComplete?: string;
  label: string;
  minLength?: number;
  name: string;
  placeholder?: string;
  required?: boolean;
  type: string;
}) {
  return (
    <label className="auth-field">
      <span className="auth-field-label">{label}</span>
      <input
        autoComplete={autoComplete}
        className="auth-field-input"
        minLength={minLength}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const plan = searchParams.get("plan");
  const queryString = searchParams.toString();
  const alternateHref =
    mode === "login"
      ? queryString
        ? `/register?${queryString}`
        : "/register"
      : queryString
        ? `/login?${queryString}`
        : "/login";

  async function handleSubmit(formData: FormData) {
    if (loading) {
      return;
    }

    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");

      if (mode === "register") {
        const fullName = String(formData.get("full_name") ?? "").trim();
        const confirmation = String(formData.get("password_confirmation") ?? "");

        if (password !== confirmation) {
          setError("Пароли не совпадают.");
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          options: {
            data: {
              full_name: fullName,
            },
          },
          password,
        });

        if (signUpError) {
          setError(mapAuthErrorMessage(signUpError.message));
          return;
        }

        if (!data.session) {
          setInfo(
            "Аккаунт создан. Если включено подтверждение email — проверьте почту, затем войдите и завершите настройку профиля.",
          );
          return;
        }

        if (data.user && (plan === "pro" || plan === "ultra")) {
          await supabase
            .from("user_profiles")
            .update({ intended_plan: plan })
            .eq("user_id", data.user.id);
        }

        router.push("/onboarding");
        router.refresh();
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(mapAuthErrorMessage(signInError.message));
        return;
      }

      const defaultPath = await resolvePostAuthPath(supabase);
      const nextPath = searchParams.get("next");
      const destination =
        defaultPath === "/onboarding" ? "/onboarding" : (nextPath ?? defaultPath);

      router.push(destination);
      router.refresh();
    } catch (authError) {
      setError(
        authError instanceof Error
          ? mapAuthErrorMessage(authError.message)
          : "Не удалось выполнить вход или регистрацию.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form action={handleSubmit} aria-busy={loading} className="auth-form">
        {mode === "register" && (plan === "pro" || plan === "ultra") ? (
          <p className="auth-plan-badge">
            Выбран план: {plan === "pro" ? "Pro" : "Ultra"} — это намерение, не оплаченный доступ.
          </p>
        ) : null}

        {mode === "register" ? (
          <AuthField
            autoComplete="name"
            label="Имя"
            name="full_name"
            placeholder="Как к вам обращаться"
            required
            type="text"
          />
        ) : null}

        <AuthField
          autoComplete="email"
          label="Email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />

        <AuthField
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          label="Пароль"
          minLength={8}
          name="password"
          placeholder={mode === "register" ? "Минимум 8 символов" : "Введите пароль"}
          required
          type="password"
        />

        {mode === "register" ? (
          <AuthField
            autoComplete="new-password"
            label="Повторите пароль"
            minLength={8}
            name="password_confirmation"
            placeholder="Повторите пароль"
            required
            type="password"
          />
        ) : null}

        {error ? (
          <p className="auth-alert-error" role="alert">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="auth-alert-info" role="status">
            {info}
          </p>
        ) : null}

        <button
          aria-busy={loading}
          aria-live="polite"
          className="auth-submit"
          disabled={loading}
          type="submit"
        >
          <span className="auth-submit-inner">
            {loading ? <span aria-hidden className="auth-spinner" /> : null}
            <span>
              {loading
                ? mode === "register"
                  ? "Создаём аккаунт…"
                  : "Входим…"
                : mode === "register"
                  ? "Создать аккаунт"
                  : "Войти"}
            </span>
          </span>
        </button>
      </form>

      <p className="auth-footer-link">
        {mode === "register" ? (
          <>
            Уже есть аккаунт? <Link href={alternateHref}>Войти</Link>
          </>
        ) : (
          <>
            Нет аккаунта? <Link href={alternateHref}>Зарегистрироваться</Link>
          </>
        )}
      </p>
    </>
  );
}
