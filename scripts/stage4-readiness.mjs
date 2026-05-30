#!/usr/bin/env node
/**
 * Stage 4 habits readiness check (read-only).
 * Usage: node scripts/stage4-readiness.mjs
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

console.log("Stage 4 — Habits readiness\n");

if (url && serviceRoleKey) {
  ok("Supabase env", "URL and service role configured");
} else {
  fail("Supabase env", "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const requiredFiles = [
  "src/lib/domain/habits.ts",
  "src/lib/domain/gamification.ts",
  "src/app/api/habits/route.ts",
  "src/app/api/habits/[id]/route.ts",
  "src/app/api/habits/[id]/complete/route.ts",
  "src/app/(app)/habits/page.tsx",
  "src/components/data/habit-card.tsx",
  "src/components/data/create-habit-form.tsx",
  "src/components/data/dashboard-habits-block.tsx",
  "supabase/migrations/0002_habits_foundation.sql",
  "supabase/migrations/0003_habit_achievements.sql",
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

for (const table of ["habits", "habit_logs"]) {
  const { error } = await admin.from(table).select("id").limit(1);

  if (error) {
    fail(`Table ${table}`, error.message);
  } else {
    ok(`Table ${table}`, "reachable");
  }
}

const { count: habitAchievementCount, error: achievementError } = await admin
  .from("achievements")
  .select("id", { count: "exact", head: true })
  .eq("condition_type", "habit_completions")
  .eq("condition_value", 1);

if (achievementError) {
  fail("Habit achievements seed", achievementError.message);
} else if ((habitAchievementCount ?? 0) === 0) {
  fail(
    "Habit achievements seed",
    "No habit_completions achievements — run node scripts/apply-migration-0003.mjs",
  );
} else {
  ok("Habit achievements seed", `${habitAchievementCount ?? 0} «Первый ритуал» row(s)`);
}

const { data: habitSample, error: habitReadError } = await admin.from("habits").select("id").limit(1);

if (habitReadError) {
  fail("Habits API schema", habitReadError.message);
} else {
  ok("Habits API schema", habitSample?.length ? "sample row readable" : "table empty (ok)");
}

const failed = checks.filter((item) => !item.ok).length;
console.log(`\n${failed === 0 ? "All checks passed." : `${failed} check(s) failed.`}`);
process.exit(failed === 0 ? 0 : 1);
