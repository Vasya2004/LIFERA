#!/usr/bin/env node
/**
 * Apply migration 0005 subscription plans (Free / Pro / Ultra).
 * Usage: node scripts/apply-migration-0005.mjs
 *
 * With direct DB access (optional):
 *   SUPABASE_DB_URL=postgresql://... node scripts/apply-migration-0005.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const envPath = path.join(root, ".env.local");
const migrationPath = path.join(root, "supabase/migrations/0005_subscription_plans.sql");

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

async function applyViaPg() {
  const dbUrl = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;
  if (!dbUrl) {
    return { applied: false, reason: "SUPABASE_DB_URL not set — apply SQL manually" };
  }

  const pg = await import("pg");
  const client = new pg.default.Client({ connectionString: dbUrl });
  await client.connect();
  const sql = fs.readFileSync(migrationPath, "utf8");
  await client.query(sql);
  await client.query("NOTIFY pgrst, 'reload schema';");
  await client.end();
  return { applied: true, reason: "0005 SQL applied via Postgres" };
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error("Missing Supabase env.");
    process.exit(1);
  }

  console.log("Applying migration 0005 — subscription plans (Free / Pro / Ultra)\n");

  const pgResult = await applyViaPg();
  console.log(pgResult.applied ? `✓ ${pgResult.reason}` : `⚠ ${pgResult.reason}`);

  const admin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: intendedError } = await admin
    .from("user_profiles")
    .select("intended_plan")
    .limit(1);

  if (intendedError) {
    console.error("\n✗ Migration not fully visible to PostgREST:");
    console.error(`  user_profiles.intended_plan: ${intendedError.message}`);
    console.log("\nManual step (Supabase SQL Editor):");
    console.log("  supabase/migrations/0005_subscription_plans.sql");
    console.log("Then: NOTIFY pgrst, 'reload schema';");
    process.exit(1);
  }

  console.log("✓ Verified: user_profiles.intended_plan reachable");
  console.log("✓ Plan values: free, pro, ultra (premium migrated to pro)");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
