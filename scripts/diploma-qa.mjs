#!/usr/bin/env node
/**
 * Stage 10 — Diploma readiness orchestrator
 * Usage: node scripts/diploma-qa.mjs
 *
 * Always runs production checks against https://lifera.app.
 * Local Playwright suite runs when DIPLOMA_QA_FULL=1 (requires dev server + .env.local).
 */
import { spawnSync } from "node:child_process";

const root = process.cwd();
const productionUrl = process.env.PRODUCTION_QA_BASE_URL ?? "https://lifera.app";
const localBase = process.env.DIPLOMA_QA_LOCAL_URL ?? "http://localhost:3000";

const localScripts = [
  "dashboard-qa.mjs",
  "habits-qa.mjs",
  "goals-qa.mjs",
  "challenges-qa.mjs",
  "progress-qa.mjs",
  "achievements-qa.mjs",
  "assistant-qa.mjs",
  "onboarding-qa.mjs",
  "branches-qa.mjs",
  "plan-qa.mjs",
  "microinteractions-qa.mjs",
  "mobile-qa.mjs",
];

function runNodeScript(script, env = {}) {
  console.log(`\n>>> node scripts/${script}\n`);
  const result = spawnSync("node", [`scripts/${script}`], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, ...env },
  });
  process.stdout.write(result.stdout ?? "");
  process.stderr.write(result.stderr ?? "");
  return result.status ?? 1;
}

function runShell(command, env = {}) {
  console.log(`\n>>> ${command}\n`);
  const result = spawnSync(command, {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, ...env },
    shell: true,
  });
  process.stdout.write(result.stdout ?? "");
  process.stderr.write(result.stderr ?? "");
  return result.status ?? 1;
}

async function main() {
  console.log("Stage 10 — Diploma readiness QA\n");

  const failures = [];

  if (runNodeScript("production-qa.mjs", { PRODUCTION_QA_BASE_URL: productionUrl }) !== 0) {
    failures.push("production-qa.mjs");
  }

  if (process.env.DIPLOMA_QA_FULL === "1") {
    if (runShell("npm run lint") !== 0) failures.push("lint");
    if (runShell("npm run build") !== 0) failures.push("build");
    if (runNodeScript("smoke.mjs", { SMOKE_BASE_URL: localBase }) !== 0) failures.push("local smoke");

    for (const script of localScripts) {
      if (runNodeScript(script) !== 0) {
        failures.push(script);
      }
    }
  } else {
    console.log(
      "\nLocal Playwright suite skipped (set DIPLOMA_QA_FULL=1 with npm run dev for full regression).\n",
    );
  }

  console.log("\n--- Diploma QA summary ---");
  if (failures.length === 0) {
    console.log("Diploma QA passed.");
    process.exit(0);
  }

  console.log(`Failed steps: ${failures.join(", ")}`);
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
