#!/usr/bin/env node
/**
 * Stage 7 Plan / Subscription Alignment readiness check (read-only).
 * Usage: node scripts/stage7-readiness.mjs
 */
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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const checks = [];

function ok(name, detail) {
  checks.push({ name, ok: true, detail });
  console.log(`✓ ${name}: ${detail}`);
}

function fail(name, detail) {
  checks.push({ name, ok: false, detail });
  console.log(`✗ ${name}: ${detail}`);
}

console.log("Stage 7 — Plan / Subscription Alignment readiness\n");

if (url && serviceRoleKey) {
  ok("Supabase env", "URL and service role configured");
} else {
  fail("Supabase env", "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const requiredFiles = [
  "supabase/migrations/0005_subscription_plans.sql",
  "scripts/apply-migration-0005.mjs",
  "src/lib/domain/plan-catalog.ts",
  "src/lib/domain/subscription.ts",
  "src/components/billing/plan-comparison.tsx",
  "src/components/billing/demo-plan-button.tsx",
  "src/app/(app)/billing/page.tsx",
  "src/app/(app)/plan/page.tsx",
  "src/app/api/subscription/activate-demo/route.ts",
];

for (const file of requiredFiles) {
  if (fs.existsSync(path.join(root, file))) {
    ok(`File ${file}`, "present");
  } else {
    fail(`File ${file}`, "missing");
  }
}

const subscriptionSource = fs.readFileSync(
  path.join(root, "src/lib/domain/subscription.ts"),
  "utf8",
);

for (const symbol of [
  "FREE_AI_WEEKLY_LIMIT",
  "FREE_PROGRESS_HISTORY_DAYS",
  "hasProAccess",
  "assertCanCreateAiRecommendation",
  "getProgressHistoryCutoff",
  "activateDemoPlan",
  "getUserIntendedPlan",
]) {
  if (subscriptionSource.includes(symbol)) {
    ok(`subscription.ts ${symbol}`, "defined");
  } else {
    fail(`subscription.ts ${symbol}`, "missing");
  }
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { error: intendedError } = await admin
  .from("user_profiles")
  .select("intended_plan")
  .limit(1);

if (intendedError) {
  fail(
    "Migration 0005 intended_plan",
    "Apply supabase/migrations/0005_subscription_plans.sql in Supabase SQL Editor",
  );
} else {
  ok("Migration 0005 intended_plan", "column reachable");
}

const { data: subscriptionSample, error: subscriptionError } = await admin
  .from("subscriptions")
  .select("plan")
  .limit(20);

if (subscriptionError) {
  fail("subscriptions.plan", subscriptionError.message);
} else {
  const invalidPlans = (subscriptionSample ?? []).filter(
    (row) => row.plan && !["free", "pro", "ultra"].includes(row.plan),
  );
  if (invalidPlans.length > 0) {
    fail("subscriptions.plan values", `Found legacy values: ${invalidPlans.map((r) => r.plan).join(", ")}`);
  } else {
    ok("subscriptions.plan values", "free / pro / ultra (sample ok)");
  }
}

const activateDemoSource = fs.readFileSync(
  path.join(root, "src/app/api/subscription/activate-demo/route.ts"),
  "utf8",
);

if (activateDemoSource.includes("isDemoPremiumEnabled")) {
  ok("Demo activation gate", "DEMO_PREMIUM_ENABLED check present");
} else {
  fail("Demo activation gate", "missing DEMO_PREMIUM_ENABLED check");
}

const authFormSource = fs.readFileSync(path.join(root, "src/components/auth/auth-form.tsx"), "utf8");
if (authFormSource.includes("intended_plan") && authFormSource.includes("намерение")) {
  ok("Register intended_plan", "saves intent, not paid access");
} else {
  fail("Register intended_plan", "missing intended_plan or intent copy");
}

const failed = checks.filter((item) => !item.ok).length;
console.log(`\n${failed === 0 ? "All checks passed." : `${failed} check(s) failed.`}`);
process.exit(failed === 0 ? 0 : 1);
