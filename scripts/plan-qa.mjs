#!/usr/bin/env node
/**
 * Stage 6 Pricing & Plan Value QA
 * Usage: node scripts/plan-qa.mjs
 * Env: PLAN_QA_BASE_URL (default http://localhost:3000)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

import { completeOnboardingWizard } from "./lib/onboarding-wizard.mjs";

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));

const baseUrl = process.env.PLAN_QA_BASE_URL ?? process.env.STAGE7_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const proEmail = `planqa-pro${timestamp}@lifera.test`;
const ultraEmail = `planqa-ultra${timestamp}@lifera.test`;
const testPassword = "PlanQaPass1!";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const report = { checks: [], errors: [] };

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
  await page.getByRole("textbox", { name: "Имя" }).fill(`Plan QA ${plan}`);
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
  await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await page.waitForURL(/\/onboarding/, { timeout: 30000 });
}

async function completeOnboarding(page, expectedPlanRedirect, migrationApplied) {
  await completeOnboardingWizard(page, { goalTitle: `Plan QA goal ${timestamp}` });

  if (migrationApplied && expectedPlanRedirect) {
    await page.waitForURL(new RegExp(`/plan\\?selected=${expectedPlanRedirect}`), {
      timeout: 90000,
    });
    pass(`Onboarding redirect /plan?selected=${expectedPlanRedirect}`, page.url());
  } else {
    await page.waitForURL(/\/dashboard/, { timeout: 90000 });
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

  const activePlan = subscription?.status === "active" ? subscription.plan : "free";

  if (activePlan === expectedPaidPlan) {
    pass(`Paid plan ${email}`, expectedPaidPlan);
  } else {
    fail(`Paid plan ${email}`, `${activePlan} !== ${expectedPaidPlan}`);
  }

  return user.id;
}

async function checkNoHorizontalScroll(page, label) {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  if (scrollWidth <= clientWidth + 1) {
    pass(`Mobile scroll (${label})`, `${scrollWidth}px ≤ ${clientWidth}px`);
  } else {
    fail(`Mobile scroll (${label})`, `overflow ${scrollWidth} > ${clientWidth}`);
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
  else pass("Migration 0005", "pending — intended_plan tests skipped");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(`${baseUrl}/pricing`, { waitUntil: "domcontentloaded" });
    const pricingText = await page.locator("body").innerText();
    if (pricingText.includes("Free") && pricingText.includes("Pro") && pricingText.includes("Ultra")) {
      pass("/pricing tiers", "Free / Pro / Ultra visible");
    } else {
      fail("/pricing tiers", "missing tier labels");
    }

    if (pricingText.includes("Стартовая система") && pricingText.includes("Полная Life OS")) {
      pass("/pricing value roles", "value subtitles visible");
    } else {
      fail("/pricing value roles", "missing role copy");
    }

    if (pricingText.includes("499 ₽") && pricingText.includes("999 ₽")) {
      pass("/pricing prices", "Pro/Ultra prices visible");
    } else {
      fail("/pricing prices", "missing prices");
    }

    await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
    const landingText = await page.locator("body").innerText();
    if (landingText.includes("Free") && landingText.includes("Pro") && landingText.includes("Ultra")) {
      pass("Landing pricing section", "tiers visible on /");
    } else {
      fail("Landing pricing section", "pricing block missing on landing");
    }

    await registerWithPlan(page, proEmail, "pro");
    await completeOnboarding(page, "pro", migrationApplied);
    if (migrationApplied) {
      await verifyUserPlanState(admin, proEmail, "pro", "free");
    }

    await page.goto(`${baseUrl}/plan`, { waitUntil: "domcontentloaded" });
    const planContent = await page.locator("body").innerText();

    if (planContent.includes("Ваш текущий план") && planContent.includes("Free")) {
      pass("/plan current plan hero", "human-readable current plan");
    } else {
      fail("/plan current plan hero", "hero missing");
    }

    if (!planContent.includes("provider") && !planContent.includes("subscription status")) {
      pass("/plan no raw billing", "no provider/status jargon");
    } else {
      fail("/plan no raw billing", "raw billing terms found");
    }

    if (planContent.includes("Сравнение возможностей")) {
      pass("/plan feature matrix", "comparison matrix visible");
    } else {
      fail("/plan feature matrix", "matrix missing");
    }

    if (planContent.includes("Рекомендуем")) {
      pass("/plan Pro recommended", "recommended badge visible");
    } else {
      fail("/plan Pro recommended", "recommended badge missing");
    }

    if (planContent.includes("Оплата скоро")) {
      pass("/plan payment honesty", "payment notice visible");
    } else {
      fail("/plan payment honesty", "payment notice missing");
    }

    if (planContent.includes("Скоро") && planContent.includes("AI-стратегия")) {
      pass("/plan Ultra honesty", "future AI marked as coming soon");
    } else {
      fail("/plan Ultra honesty", "Ultra AI honesty copy missing");
    }

    if (planContent.includes("Вы выбрали Pro") || planContent.includes("Выбран при регистрации")) {
      pass("/plan selected intent", "Pro intent highlighted");
    } else {
      fail("/plan selected intent", "intent highlight missing");
    }

    for (let index = 0; index < 2; index += 1) {
      const response = await page.request.post(`${baseUrl}/api/goals`, {
        data: { title: `Plan QA extra goal ${timestamp}-${index}`, life_area: "projects" },
      });
      if (response.status() === 201) pass(`Free goal limit create ${index + 2}/3`, "201");
      else fail(`Free goal limit create ${index + 2}/3`, String(response.status()));
    }

    const blocked = await page.request.post(`${baseUrl}/api/goals`, {
      data: { title: `Plan QA blocked goal ${timestamp}`, life_area: "projects" },
    });
    const blockedPayload = await blocked.json().catch(() => ({}));
    if (blocked.status() === 403 && blockedPayload.code === "PLAN_LIMIT") {
      pass("Free goal limit 403", "PLAN_LIMIT");
    } else {
      fail("Free goal limit 403", `${blocked.status()} ${JSON.stringify(blockedPayload)}`);
    }

    const mobilePage = await context.newPage();
    await mobilePage.setViewportSize({ height: 844, width: 390 });
    await mobilePage.goto(`${baseUrl}/plan`, { waitUntil: "domcontentloaded" });
    await checkNoHorizontalScroll(mobilePage, "/plan 390px");
    await mobilePage.close();

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

    const ultraPage = await context.newPage();
    await registerWithPlan(ultraPage, ultraEmail, "ultra");
    await completeOnboarding(ultraPage, "ultra", migrationApplied);
    if (migrationApplied) {
      await verifyUserPlanState(admin, ultraEmail, "ultra", "free");
    }
    await ultraPage.goto(`${baseUrl}/plan?selected=ultra`, { waitUntil: "domcontentloaded" });
    const ultraPlanText = await ultraPage.locator("body").innerText();
    if (ultraPlanText.includes("Ultra") && ultraPlanText.includes("Вы выбрали Ultra")) {
      pass("/plan?selected=ultra", "selected Ultra highlighted");
    } else {
      fail("/plan?selected=ultra", "Ultra selection notice missing");
    }
    await ultraPage.close();
  } catch (error) {
    fail("QA runtime", error instanceof Error ? error.message : String(error));
  } finally {
    await browser.close();
  }

  console.log(`\nPlan QA: ${report.checks.length} checks, ${report.errors.length} errors`);
  process.exit(report.errors.length === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
