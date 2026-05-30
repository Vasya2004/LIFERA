#!/usr/bin/env node
/**
 * Unified Lifera smoke test — env, Supabase, readiness scripts, optional route checks.
 * Usage: node scripts/smoke.mjs
 *
 * Optional: SMOKE_BASE_URL=http://localhost:3000 (requires dev server for route checks)
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const envPath = path.join(root, ".env.local");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(envPath);

const checks = [];

function ok(name, detail) {
  checks.push({ name, ok: true, detail });
  console.log(`✓ ${name}: ${detail}`);
}

function fail(name, detail) {
  checks.push({ name, ok: false, detail });
  console.log(`✗ ${name}: ${detail}`);
}

function warn(name, detail) {
  checks.push({ name, ok: true, detail, warn: true });
  console.log(`⚠ ${name}: ${detail}`);
}

console.log("Lifera — unified smoke test\n");

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

for (const key of requiredEnv) {
  if (process.env[key]) ok(`Env ${key}`, "set");
  else fail(`Env ${key}`, "missing");
}

if (process.env.DEMO_PREMIUM_ENABLED === "true") {
  warn("DEMO_PREMIUM_ENABLED", "true — disable in production");
} else {
  ok("DEMO_PREMIUM_ENABLED", "false or unset");
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (url && serviceRoleKey) {
  const admin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const coreTables = [
    "user_profiles",
    "goals",
    "challenges",
    "habits",
    "subscriptions",
    "achievements",
    "skills",
    "health_metrics",
    "finance_metrics",
  ];

  for (const table of coreTables) {
    const { error } = await admin.from(table).select("id").limit(1);
    if (error) fail(`Table ${table}`, error.message);
    else ok(`Table ${table}`, "reachable");
  }

  const { error: intendedError } = await admin.from("user_profiles").select("intended_plan").limit(1);
  if (intendedError) fail("Migration 0005 intended_plan", intendedError.message);
  else ok("Migration 0005 intended_plan", "column reachable");

  const { data: achievementRows, error: achievementError } = await admin
    .from("achievements")
    .select("user_id, condition_type, condition_value")
    .not("user_id", "is", null)
    .limit(5000);

  if (achievementError) {
    fail("Achievements dedupe check", achievementError.message);
  } else {
    const seen = new Set();
    let duplicates = 0;
    for (const row of achievementRows ?? []) {
      const key = `${row.user_id}:${row.condition_type}:${row.condition_value}`;
      if (seen.has(key)) duplicates += 1;
      seen.add(key);
    }

    if (duplicates > 0) {
      fail(
        "Migration 0006 achievement uniqueness",
        `${duplicates} duplicate row(s) — apply supabase/migrations/0006_achievement_uniqueness.sql`,
      );
    } else {
      ok("Migration 0006 achievement uniqueness", "no duplicates in sample");
    }
  }
} else {
  fail("Supabase connection", "missing env — skipped table checks");
}

const readinessScripts = [
  "stage3-readiness.mjs",
  "stage4-readiness.mjs",
  "stage6-readiness.mjs",
  "stage7-readiness.mjs",
];

for (const script of readinessScripts) {
  const scriptPath = path.join(root, "scripts", script);
  if (!fs.existsSync(scriptPath)) {
    fail(`Script ${script}`, "missing");
    continue;
  }

  const result = spawnSync("node", [scriptPath], {
    cwd: root,
    encoding: "utf8",
    env: process.env,
  });

  if (result.status === 0) ok(`Readiness ${script}`, "passed");
  else fail(`Readiness ${script}`, "failed — see output above");
}

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const publicRoutes = ["/", "/pricing", "/login", "/register"];
const appRoutes = [
  "/dashboard",
  "/goals",
  "/challenges",
  "/habits",
  "/progress",
  "/skills",
  "/health",
  "/finance",
  "/plan",
];

async function probeRoute(route) {
  try {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
    return response.status;
  } catch {
    return "ECONNREFUSED";
  }
}

let devServerAvailable = true;
const firstProbe = await probeRoute("/");
if (firstProbe === "ECONNREFUSED") {
  devServerAvailable = false;
  warn(
    "Dev server routes",
    `not reachable at ${baseUrl} — start with npm run dev to check app routes`,
  );
} else {
  ok("Dev server", baseUrl);

  for (const route of [...publicRoutes, ...appRoutes]) {
    const status = await probeRoute(route);
    if (typeof status === "number" && [200, 307, 308].includes(status)) {
      ok(`Route ${route}`, String(status));
    } else {
      fail(`Route ${route}`, String(status));
    }
  }
}

const failed = checks.filter((item) => !item.ok).length;
console.log(
  `\n${failed === 0 ? "Smoke test passed." : `${failed} check(s) failed.`}${
    devServerAvailable ? "" : " (route checks skipped — no dev server)"
  }`,
);
process.exit(failed === 0 ? 0 : 1);
