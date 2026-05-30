import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell mode="login">
      <Suspense fallback={<p className="auth-subtitle">Загрузка формы…</p>}>
        <AuthForm mode="login" />
      </Suspense>
    </AuthShell>
  );
}
