#!/usr/bin/env node
/**
 * Stage 6 Skills / Health / Finance readiness check (read-only).
 * Usage: node scripts/stage6-readiness.mjs
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

console.log("Stage 6 — Skills / Health / Finance readiness\n");

if (url && serviceRoleKey) {
  ok("Supabase env", "URL and service role configured");
} else {
  fail("Supabase env", "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const requiredFiles = [
  "src/lib/domain/skills.ts",
  "src/lib/domain/health.ts",
  "src/lib/domain/finance.ts",
  "src/lib/domain/branches.ts",
  "src/app/api/skills/route.ts",
  "src/app/api/skills/[id]/route.ts",
  "src/app/api/health/metrics/route.ts",
  "src/app/api/finance/metrics/route.ts",
  "src/app/(app)/skills/page.tsx",
  "src/app/(app)/health/page.tsx",
  "src/app/(app)/finance/page.tsx",
  "src/components/data/skill-card.tsx",
  "src/components/data/create-skill-form.tsx",
  "src/components/data/create-health-entry-form.tsx",
  "src/components/data/create-finance-entry-form.tsx",
  "supabase/migrations/0004_branch_extensions.sql",
];

for (const file of requiredFiles) {
  if (fs.existsSync(path.join(root, file))) {
    ok(`File ${file}`, "present");
  } else {
    fail(`File ${file}`, "missing");
  }
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

for (const table of ["skills", "health_metrics", "finance_metrics"]) {
  const { error } = await admin.from(table).select("id").limit(1);
  if (error) {
    fail(`Table ${table}`, error.message);
  } else {
    ok(`Table ${table}`, "reachable");
  }
}

const { error: skillsStatusError } = await admin.from("skills").select("status").limit(1);
if (skillsStatusError) {
  fail(
    "Migration 0004 skills.status",
    "Apply supabase/migrations/0004_branch_extensions.sql in Supabase SQL Editor",
  );
} else {
  ok("Migration 0004 skills.status", "column reachable");
}

const { error: healthNoteError } = await admin.from("health_metrics").select("note").limit(1);
if (healthNoteError) {
  fail("Migration 0004 health_metrics.note", healthNoteError.message);
} else {
  ok("Migration 0004 health_metrics.note", "column reachable");
}

const failed = checks.filter((item) => !item.ok).length;
console.log(`\n${failed === 0 ? "All checks passed." : `${failed} check(s) failed.`}`);
process.exit(failed === 0 ? 0 : 1);
