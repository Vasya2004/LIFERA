"use client";

import dynamic from "next/dynamic";

const AuthShaderBackground = dynamic(
  () =>
    import("@/components/auth/auth-shader-background").then(
      (module) => module.AuthShaderBackground,
    ),
  { ssr: false },
);

export function AuthLavaBackground() {
  return <AuthShaderBackground />;
}
