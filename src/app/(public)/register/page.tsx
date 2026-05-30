import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function RegisterPage() {
  return (
    <AuthShell mode="register">
      <Suspense fallback={<p className="auth-subtitle">Загрузка формы…</p>}>
        <AuthForm mode="register" />
      </Suspense>
    </AuthShell>
  );
}
