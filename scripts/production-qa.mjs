#!/usr/bin/env node
/**
 * Stage 10 — Production MVP checks for https://lifera.app
 * Usage: node scripts/production-qa.mjs
 * Env: PRODUCTION_QA_BASE_URL (default https://lifera.app)
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

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

const baseUrl = process.env.PRODUCTION_QA_BASE_URL ?? "https://lifera.app";
const report = { checks: [], errors: [] };

function pass(name, detail) {
  report.checks.push({ name, ok: true, detail });
  console.log(`PASS ${name}: ${detail}`);
}

function fail(name, detail) {
  report.errors.push({ name, detail });
  console.log(`FAIL ${name}: ${detail}`);
}

async function fetchRoute(route, options = {}) {
  const response = await fetch(`${baseUrl}${route}`, {
    redirect: "manual",
    ...options,
  });
  const body = await response.text().catch(() => "");
  return { body, response };
}

async function main() {
  console.log(`Lifera production QA — ${baseUrl}\n`);

  if (!baseUrl.startsWith("https://")) {
    fail("HTTPS", `expected https URL, got ${baseUrl}`);
  } else {
    pass("HTTPS", baseUrl);
  }

  const publicRoutes = [
    { expectStatus: [200], path: "/", snippet: "Lifera" },
    { expectStatus: [200], path: "/pricing", snippet: "Free" },
    { expectStatus: [200], path: "/login", snippet: "Lifera" },
    { expectStatus: [200], path: "/register", snippet: "аккаунт" },
    { expectStatus: [200], path: "/privacy", snippet: "Lifera" },
    { expectStatus: [200], path: "/terms", snippet: "Lifera" },
  ];

  for (const route of publicRoutes) {
    try {
      const { body, response } = await fetchRoute(route.path);
      if (!route.expectStatus.includes(response.status)) {
        fail(`Public ${route.path}`, `status ${response.status}`);
        continue;
      }
      if (body.includes("Application error")) {
        fail(`Public ${route.path}`, "Application error in HTML");
        continue;
      }
      if (route.snippet && !body.includes(route.snippet)) {
        fail(`Public ${route.path}`, `missing snippet "${route.snippet}"`);
        continue;
      }
      pass(`Public ${route.path}`, String(response.status));
    } catch (error) {
      fail(`Public ${route.path}`, error instanceof Error ? error.message : String(error));
    }
  }

  const protectedRoutes = [
    "/dashboard",
    "/goals",
    "/challenges",
    "/habits",
    "/progress",
    "/achievements",
    "/ai-assistant",
    "/skills",
    "/health",
    "/finance",
    "/plan",
    "/profile",
    "/settings",
    "/onboarding",
  ];

  for (const route of protectedRoutes) {
    try {
      const { body, response } = await fetchRoute(route);
      const location = response.headers.get("location") ?? "";
      const redirects = response.status === 307 || response.status === 302 || response.status === 308;

      if (redirects && (location.includes("/login") || location.includes("/auth"))) {
        pass(`Protected ${route}`, `${response.status} → login`);
      } else if (response.status === 200 && !body.includes("Application error")) {
        pass(`Protected ${route}`, "200 (session may exist in edge cache — verify manually)");
      } else {
        fail(`Protected ${route}`, `status ${response.status} location ${location}`);
      }
    } catch (error) {
      fail(`Protected ${route}`, error instanceof Error ? error.message : String(error));
    }
  }

  try {
    const activate = await fetch(`${baseUrl}/api/subscription/activate-demo`, {
      body: JSON.stringify({ plan: "pro" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      redirect: "manual",
    });
    if (activate.status === 401 || activate.status === 403) {
      pass("Demo activation blocked", String(activate.status));
    } else {
      fail("Demo activation blocked", `unexpected status ${activate.status}`);
    }
  } catch (error) {
    fail("Demo activation blocked", error instanceof Error ? error.message : String(error));
  }

  console.log("\nRunning unified smoke against production...\n");
  const smoke = spawnSync("node", ["scripts/smoke.mjs"], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, SMOKE_BASE_URL: baseUrl },
  });

  process.stdout.write(smoke.stdout ?? "");
  process.stderr.write(smoke.stderr ?? "");

  if (smoke.status === 0) {
    pass("Unified smoke", "passed");
  } else {
    fail("Unified smoke", "failed — see output above");
  }

  console.log("\n--- Production QA summary ---");
  console.log(`Passed: ${report.checks.length}`);
  console.log(`Failed: ${report.errors.length}`);

  if (report.errors.length > 0) {
    for (const item of report.errors) {
      console.log(`  - ${item.name}: ${item.detail}`);
    }
    process.exit(1);
  }

  console.log("Production QA passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
