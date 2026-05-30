#!/usr/bin/env node
/**
 * Apply migration 0003 habit achievements (idempotent backfill + optional SQL).
 * Usage: node scripts/apply-migration-0003.mjs
 *
 * With direct DB access (optional):
 *   SUPABASE_DB_URL=postgresql://... node scripts/apply-migration-0003.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const envPath = path.join(root, ".env.local");
const migrationPath = path.join(root, "supabase/migrations/0003_habit_achievements.sql");

const HABIT_ACHIEVEMENTS = [
  {
    title: "Первый ритуал",
    description: "Выполнить первую привычку.",
    condition_type: "habit_completions",
    condition_value: 1,
    xp_reward: 30,
  },
  {
    title: "Серия 3 дня",
    description: "Удержать streak привычки 3 дня.",
    condition_type: "habit_streak",
    condition_value: 3,
    xp_reward: 50,
  },
  {
    title: "Серия 7 дней",
    description: "Удержать streak привычки 7 дней.",
    condition_type: "habit_streak",
    condition_value: 7,
    xp_reward: 100,
  },
  {
    title: "Стабильная прокачка",
    description: "Выполнить 10 ритуалов прокачки.",
    condition_type: "habit_completions",
    condition_value: 10,
    xp_reward: 120,
  },
];

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
const dbUrl = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

async function applyTriggerSqlViaPg() {
  if (!dbUrl) {
    return { applied: false, reason: "SUPABASE_DB_URL not set — skip trigger SQL" };
  }

  const pgModule = await import("pg").catch(() => null);
  if (!pgModule) {
    return {
      applied: false,
      reason: "pg module not installed — run trigger SQL manually in Supabase SQL Editor",
    };
  }

  const sql = fs.readFileSync(migrationPath, "utf8");
  const client = new pgModule.default.Client({ connectionString: dbUrl });

  try {
    await client.connect();
    await client.query(sql);
    return { applied: true, reason: "Full 0003 SQL applied via postgres" };
  } finally {
    await client.end().catch(() => null);
  }
}

async function backfillHabitAchievements(admin) {
  let page = 1;
  let inserted = 0;
  let skipped = 0;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) {
      throw new Error(error.message);
    }

    const users = data?.users ?? [];
    if (users.length === 0) {
      break;
    }

    for (const user of users) {
      const { data: existing, error: existingError } = await admin
        .from("achievements")
        .select("condition_type, condition_value")
        .eq("user_id", user.id);

      if (existingError) {
        throw new Error(existingError.message);
      }

      const existingKeys = new Set(
        (existing ?? []).map((row) => `${row.condition_type}:${row.condition_value}`),
      );

      const rowsToInsert = HABIT_ACHIEVEMENTS.filter(
        (seed) => !existingKeys.has(`${seed.condition_type}:${seed.condition_value}`),
      ).map((seed) => ({
        ...seed,
        status: "locked",
        user_id: user.id,
      }));

      if (rowsToInsert.length === 0) {
        skipped += 1;
        continue;
      }

      const { error: insertError } = await admin.from("achievements").insert(rowsToInsert);
      if (insertError) {
        throw new Error(insertError.message);
      }

      inserted += rowsToInsert.length;
    }

    if (users.length < 100) {
      break;
    }

    page += 1;
  }

  return { inserted, skippedUsers: skipped };
}

async function main() {
  if (!url || !serviceRoleKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const admin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("Applying migration 0003 — habit achievements\n");

  const pgResult = await applyTriggerSqlViaPg();
  console.log(
    pgResult.applied
      ? `✓ Trigger SQL: ${pgResult.reason}`
      : `⚠ Trigger SQL: ${pgResult.reason}`,
  );

  const backfill = await backfillHabitAchievements(admin);
  console.log(`✓ Backfill: inserted ${backfill.inserted} achievement row(s)`);
  console.log(`✓ Users already complete: ${backfill.skippedUsers}`);

  const { count, error } = await admin
    .from("achievements")
    .select("id", { count: "exact", head: true })
    .eq("condition_type", "habit_completions")
    .eq("condition_value", 1);

  if (error) {
    console.error(`✗ Verification failed: ${error.message}`);
    process.exit(1);
  }

  if ((count ?? 0) === 0) {
    console.error("✗ No habit_completions achievements after backfill");
    process.exit(1);
  }

  console.log(`✓ Verified: ${count ?? 0} «Первый ритуал» row(s) in achievements`);

  const { error: habitsProbeError } = await admin.from("habits").select("id").limit(1);
  if (habitsProbeError) {
    console.log("\n⚠ habits table not visible to PostgREST:");
    console.log(`  ${habitsProbeError.message}`);
    console.log("Apply supabase/migrations/0002_habits_foundation.sql in Supabase SQL Editor, then run:");
    console.log("  NOTIFY pgrst, 'reload schema';");
  }

  if (!pgResult.applied) {
    console.log("\nManual step (Supabase SQL Editor):");
    console.log("Run the full file:");
    console.log("  supabase/migrations/0003_habit_achievements.sql");
    console.log("This updates create_lifera_profile() for new registrations.");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
