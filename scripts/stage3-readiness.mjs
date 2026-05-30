#!/usr/bin/env node
/**
 * Stage 3 Supabase readiness check (read-only).
 * Usage: node scripts/stage3-readiness.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const envPath = path.join(root, ".env.local");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const index = trimmed.indexOf("=");
    if (index === -1) {
      continue;
    }

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(envPath);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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

console.log("Stage 3 — Supabase readiness\n");

if (url && anonKey) {
  ok("Public Supabase env", "NEXT_PUBLIC_SUPABASE_URL and ANON_KEY set");
} else {
  fail("Public Supabase env", "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

if (serviceRoleKey) {
  ok("Service role env", "SUPABASE_SERVICE_ROLE_KEY set (server-only)");
} else {
  fail("Service role env", "SUPABASE_SERVICE_ROLE_KEY missing — stage completion / XP will return 503");
}

if (!url || !serviceRoleKey) {
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const requiredTables = [
  "user_profiles",
  "goals",
  "challenges",
  "challenge_stages",
  "xp_transactions",
  "achievements",
  "subscriptions",
  "habits",
  "habit_logs",
];

for (const table of requiredTables) {
  const probe =
    table === "habits" || table === "habit_logs"
      ? await admin.from(table).select("id").limit(1)
      : await admin.from(table).select("*", { count: "exact", head: true });

  const { error } = probe;

  if (error) {
    fail(`Table ${table}`, error.message);
  } else {
    ok(`Table ${table}`, "reachable");
  }
}

const { count: templateCount, error: templateError } = await admin
  .from("challenges")
  .select("id", { count: "exact", head: true })
  .eq("is_template", true);

if (templateError) {
  fail("Challenge templates seed", templateError.message);
} else {
  ok("Challenge templates seed", `${templateCount ?? 0} template(s)`);
}

const failed = checks.filter((item) => !item.ok).length;
console.log(`\n${failed === 0 ? "All checks passed." : `${failed} check(s) failed.`}`);
process.exit(failed === 0 ? 0 : 1);
