#!/usr/bin/env node
/** Backward-compatible alias for Stage 7 plan QA. Prefer: node scripts/plan-qa.mjs */
import { spawnSync } from "node:child_process";
import path from "node:path";

const script = path.join(process.cwd(), "scripts/plan-qa.mjs");
const result = spawnSync(process.execPath, [script], { stdio: "inherit" });
process.exit(result.status ?? 1);
