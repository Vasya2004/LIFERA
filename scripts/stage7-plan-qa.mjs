#!/usr/bin/env node
/**
 * Stage 7 plan / subscription QA — Playwright + API checks.
 * Usage: node scripts/stage7-plan-qa.mjs
 *
 * Requires dev server: npm run dev (default http://localhost:3000)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
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

const baseUrl = process.env.STAGE7_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const proEmail = `stage7pro${timestamp}@lifera.test`;
const ultraEmail = `stage7ultra${timestamp}@lifera.test`;
const testPassword = "Stage7QaPass1!";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const report = { checks: [], errors: [] };

function pass(name, detail) {
  report.checks.push({ name, ok: true, detail });
  console.log(`✓ ${name}: ${detail}`);
}

function fail(name, detail) {
  report.errors.push({ name, detail });
  console.log(`✗ ${name}: ${detail}`);
}

async function isMigration0005Applied(admin) {
  const { error } = await admin.from("user_profiles").select("intended_plan").limit(1);
  return !error;
}

async function registerWithPlan(page, email, plan) {
  await page.goto(`${baseUrl}/register?plan=${plan}`, { waitUntil: "domcontentloaded" });
  const badge = await page.locator(".auth-plan-badge").innerText().catch(() => "");
  if (badge.includes("намерение")) pass(`Register ?plan=${plan} badge`, "intent copy visible");
  else fail(`Register ?plan=${plan} badge`, badge || "missing");

  await page.getByRole("textbox", { name: "Имя" }).fill(`Stage7 ${plan}`);
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
  await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await page.waitForURL(/\/onboarding/, { timeout: 30000 });
}

async function completeOnboarding(page, expectedPlanRedirect, migrationApplied) {
  await page.getByRole("textbox", { name: "Название цели" }).fill(`Stage7 goal ${timestamp}`);
  await page
    .getByRole("checkbox", {
      name: "Создать стартовую цель, челлендж с этапами и открыть Dashboard с моими данными.",
    })
    .check();
  const onboardingComplete = page.waitForResponse(
    (response) =>
      response.url().includes("/api/onboarding/complete") && response.status() === 200,
    { timeout: 90000 },
  );
  await page.getByRole("button", { name: "Запустить Life RPG-систему" }).click();
  await onboardingComplete;

  if (migrationApplied && expectedPlanRedirect) {
    await page.waitForURL(new RegExp(`/plan\\?selected=${expectedPlanRedirect}`), {
      timeout: 90000,
    });
    pass(`Onboarding redirect /plan?selected=${expectedPlanRedirect}`, page.url());
  } else {
    await page.waitForURL(/\/dashboard/, { timeout: 90000 });
    pass("Onboarding redirect /dashboard", page.url());
  }
}

async function verifyUserPlanState(admin, email, expectedIntended, expectedPaidPlan) {
  const { data: users } = await admin.auth.admin.listUsers();
  const user = users?.users?.find((item) => item.email === email);
  if (!user) {
    fail(`User lookup ${email}`, "not found");
    return null;
  }

  const { data: profile } = await admin
    .from("user_profiles")
    .select("intended_plan,plan")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.intended_plan === expectedIntended) {
    pass(`intended_plan ${email}`, expectedIntended);
  } else {
    fail(`intended_plan ${email}`, `${profile?.intended_plan ?? "null"} !== ${expectedIntended}`);
  }

  const { data: subscription } = await admin
    .from("subscriptions")
    .select("plan,status")
    .eq("user_id", user.id)
    .maybeSingle();

  const activePlan =
    subscription?.status === "active" ? subscription.plan : "free";

  if (activePlan === expectedPaidPlan) {
    pass(`Paid plan ${email}`, expectedPaidPlan);
  } else {
    fail(`Paid plan ${email}`, `${activePlan} !== ${expectedPaidPlan}`);
  }

  return user.id;
}

async function testGoalLimit(page) {
  for (let index = 0; index < 2; index += 1) {
    const response = await page.request.post(`${baseUrl}/api/goals`, {
      data: { title: `Extra goal ${timestamp}-${index}`, life_area: "projects" },
    });
    if (response.status() === 201) pass(`Goal create ${index + 2}/3`, "201");
    else fail(`Goal create ${index + 2}/3`, String(response.status()));
  }

  const blocked = await page.request.post(`${baseUrl}/api/goals`, {
    data: { title: `Blocked goal ${timestamp}`, life_area: "projects" },
  });
  const payload = await blocked.json().catch(() => ({}));
  if (blocked.status() === 403 && payload.code === "PLAN_LIMIT") {
    pass("Free goal limit 403", "PLAN_LIMIT");
  } else {
    fail("Free goal limit 403", `${blocked.status()} ${JSON.stringify(payload)}`);
  }
}

async function main() {
  if (!url || !serviceRoleKey) {
    console.error("Missing Supabase env for QA verification.");
    process.exit(1);
  }

  const admin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const migrationApplied = await isMigration0005Applied(admin);
  if (migrationApplied) pass("Migration 0005", "intended_plan column reachable");
  else pass("Migration 0005", "pending — intended_plan tests skipped (apply 0005 SQL)");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await registerWithPlan(page, proEmail, "pro");
    await completeOnboarding(page, "pro", migrationApplied);
    if (migrationApplied) {
      await verifyUserPlanState(admin, proEmail, "pro", "free");
    }

    await page.goto(`${baseUrl}/plan`, { waitUntil: "domcontentloaded" });
    const planContent = await page.locator("body").innerText();
    if (planContent.includes("Free") && planContent.includes("Pro") && planContent.includes("Ultra")) {
      pass("/plan comparison tiers", "Free / Pro / Ultra visible");
    } else {
      fail("/plan comparison tiers", "missing tier labels");
    }

    if (planContent.includes("Текущий") && planContent.includes("Free")) {
      pass("/plan current plan", "Free shown as current");
    } else {
      fail("/plan current plan", "Free current badge missing");
    }

    await testGoalLimit(page);

    const demoDisabled = process.env.DEMO_PREMIUM_ENABLED !== "true";
    const demoResponse = await page.request.post(`${baseUrl}/api/subscription/activate-demo`, {
      data: { plan: "pro" },
    });
    if (demoDisabled && demoResponse.status() === 403) {
      pass("Demo activation disabled", "403 when DEMO_PREMIUM_ENABLED=false");
    } else if (!demoDisabled && demoResponse.ok()) {
      pass("Demo activation enabled", String(demoResponse.status()));
    } else {
      fail(
        "Demo activation gate",
        `status=${demoResponse.status()} DEMO_PREMIUM_ENABLED=${process.env.DEMO_PREMIUM_ENABLED}`,
      );
    }

    await page.goto(`${baseUrl}/pricing`, { waitUntil: "domcontentloaded" });
    const pricingText = await page.locator("body").innerText();
    if (pricingText.includes("Free") && pricingText.includes("Pro") && pricingText.includes("Ultra")) {
      pass("/pricing tiers", "Free / Pro / Ultra visible");
    } else {
      fail("/pricing tiers", "missing tier labels");
    }

    const ultraPage = await browser.newPage();
    await registerWithPlan(ultraPage, ultraEmail, "ultra");
    await completeOnboarding(ultraPage, "ultra", migrationApplied);
    if (migrationApplied) {
      await verifyUserPlanState(admin, ultraEmail, "ultra", "free");
    }
    await ultraPage.close();

    const reportPath = path.join(root, "output/stage7-qa-report.json");
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(
      reportPath,
      JSON.stringify({ timestamp: new Date().toISOString(), ...report }, null, 2),
    );
    console.log(`\nReport: ${reportPath}`);
  } catch (error) {
    fail("QA runtime", error instanceof Error ? error.message : String(error));
  } finally {
    await browser.close();
  }

  const failed = report.errors.length;
  console.log(`\n${failed === 0 ? "All QA checks passed." : `${failed} check(s) failed.`}`);
  process.exit(failed === 0 ? 0 : 1);
}

main();
