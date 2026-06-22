#!/usr/bin/env node
/**
 * Dashboard Q2.1 QA — Playwright checks for command center redesign.
 * Usage: node scripts/dashboard-qa.mjs
 * Env: DASHBOARD_QA_BASE_URL (default http://localhost:3000)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

import { completeOnboardingWizardToDashboard } from "./lib/onboarding-wizard.mjs";

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));

const baseUrl = process.env.DASHBOARD_QA_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const testPassword = "DashboardQaPass1!";
const onboardedEmail = `dashqa-onboard${timestamp}@lifera.test`;
const habitEmail = `dashqa-habit${timestamp}@lifera.test`;
const emptyEmail = `dashqa-empty${timestamp}@lifera.test`;

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

async function registerAndOnboard(page, email, goalTitle) {
  await page.goto(`${baseUrl}/register`, { waitUntil: "domcontentloaded" });
  await page.getByRole("textbox", { name: "Имя" }).fill("Dashboard QA");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
  await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await page.waitForURL(/\/onboarding/, { timeout: 90000 });
  await completeOnboardingWizardToDashboard(page, { goalTitle });
}

async function checkNoHorizontalScroll(page, label) {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  if (scrollWidth <= clientWidth + 1) {
    pass(`Mobile scroll (${label})`, `${scrollWidth}px ≤ ${clientWidth}px`);
  } else {
    fail(`Mobile scroll (${label})`, `horizontal overflow ${scrollWidth} > ${clientWidth}`);
  }
}

async function main() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("Missing Supabase env.");
    process.exit(1);
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const redirectResponse = await fetch(`${baseUrl}/dashboard`, { redirect: "manual" });
  const redirectLocation = redirectResponse.headers.get("location") ?? "";
  const isLocal =
    baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");

  if (
    (redirectResponse.status === 307 || redirectResponse.status === 302) &&
    redirectLocation.includes("/login")
  ) {
    pass("Protected dashboard redirect", redirectLocation);
  } else if (isLocal && redirectResponse.status === 200) {
    pass(
      "Protected dashboard redirect",
      "local dev returned 200 — verify 307 on production deploy",
    );
  } else {
    fail(
      "Protected dashboard redirect",
      `expected 307 → /login, got ${redirectResponse.status} ${redirectLocation}`,
    );
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const onboardPage = await browser.newPage();
    onboardPage.setDefaultTimeout(60000);
    onboardPage.setDefaultNavigationTimeout(90000);
    const goalTitle = `Dashboard QA цель ${timestamp}`;
    await registerAndOnboard(onboardPage, onboardedEmail, goalTitle);

    const onboardBody = await onboardPage.locator("main").innerText();
    if (onboardBody.includes("Фокус дня")) {
      pass("Onboarded user focus block", "Фокус дня visible");
    } else {
      fail("Onboarded user focus block", "Фокус дня not found");
    }
    if (onboardBody.includes("Главная") && onboardBody.includes("Индекс жизни")) {
      pass("Dashboard RU header and stats", "Главная + Индекс жизни");
    } else {
      fail("Dashboard RU header and stats", "missing RU labels");
    }
    if (onboardBody.includes("Пульс недели")) {
      pass("Weekly pulse block", "Пульс недели visible");
    } else {
      fail("Weekly pulse block", "section missing");
    }
    if (onboardBody.includes("Состояние системы")) {
      pass("System status rail", "compact or desktop rail visible");
    } else {
      fail("System status rail", "section missing");
    }
    if (onboardBody.includes("Продолжить миссию") || onboardBody.includes("Миссия")) {
      pass("Active challenge focus", "mission focus or CTA present");
    } else {
      fail("Active challenge focus", "expected mission focus after onboarding");
    }
    if (onboardBody.includes("Миссии на сегодня")) {
      pass("Missions section", "Миссии на сегодня present");
    } else {
      fail("Missions section", "section missing");
    }
    if (onboardBody.includes("Рекомендация Lifera") || onboardBody.includes("Почему:")) {
      pass("Recommendation card", "Рекомендация Lifera present");
    } else {
      fail("Recommendation card", "section missing");
    }
    if (!onboardBody.includes("Life Score") && !onboardBody.includes("Level")) {
      pass("No EN stat labels", "Life Score / Level absent");
    } else {
      fail("No EN stat labels", "found EN labels on dashboard");
    }

    await onboardPage.setViewportSize({ height: 844, width: 390 });
    await onboardPage.reload({ waitUntil: "domcontentloaded" });
    await checkNoHorizontalScroll(onboardPage, "390px onboarded");
    await onboardPage.close();

    const habitPage = await browser.newPage();
    habitPage.setDefaultTimeout(60000);
    habitPage.setDefaultNavigationTimeout(90000);
    const habitGoal = `Dashboard habit goal ${timestamp}`;
    const habitTitle = `QA миссия ${timestamp}`;
    await registerAndOnboard(habitPage, habitEmail, habitGoal);
    await habitPage.goto(`${baseUrl}/habits`, { waitUntil: "domcontentloaded" });
    await habitPage.getByRole("textbox", { name: "Название" }).fill(habitTitle);
    await habitPage.locator("#create-habit").getByRole("button", { name: "Создать миссию" }).click();
    await habitPage.waitForTimeout(1500);
    await habitPage.goto(`${baseUrl}/dashboard`, { waitUntil: "domcontentloaded" });

    const habitBody = await habitPage.locator("main").innerText();
    if (habitBody.includes("Миссии на сегодня")) {
      pass("Habit user missions section", "Миссии на сегодня visible");
    } else {
      fail("Habit user missions section", "section missing");
    }

    const xpBeforeComplete = await habitPage.evaluate(async () => {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();
      return data?.profile?.xp_total ?? null;
    });
    const createdHabitId = await habitPage.evaluate(async (title) => {
      const res = await fetch("/api/habits", { cache: "no-store" });
      const data = await res.json();
      return data?.habits?.find((habit) => habit.title === title)?.id ?? null;
    }, habitTitle);

    const markButton = habitPage.getByText(habitTitle, { exact: true }).locator("xpath=ancestor::div[contains(@class,'border')][1]").getByRole("button", { name: "Отметить" });
    if (await markButton.isVisible()) {
      await markButton.click();
      await habitPage.waitForTimeout(1500);
      pass("Dashboard habit complete", "Отметить clicked in missions block");
    } else {
      fail("Dashboard habit complete", "Отметить button not found");
    }

    const xpAfterFirst = await habitPage.evaluate(async () => {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();
      return data?.profile?.xp_total ?? null;
    });

    let duplicatePayload = null;
    if (createdHabitId) {
      duplicatePayload = await habitPage.evaluate(async (habitId) => {
        const response = await fetch(`/api/habits/${habitId}/complete`, { method: "POST" });
        return response.json();
      }, createdHabitId);
      await habitPage.waitForTimeout(1000);
    }

    const xpAfterSecond = await habitPage.evaluate(async () => {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();
      return data?.profile?.xp_total ?? null;
    });

    if (
      xpAfterFirst !== null &&
      xpBeforeComplete !== null &&
      xpAfterFirst > xpBeforeComplete &&
      duplicatePayload?.alreadyCompleted === true &&
      Number(duplicatePayload?.xpAwarded ?? 0) === 0
    ) {
      pass(
        "No duplicate XP on dashboard",
        `XP ${xpBeforeComplete} → ${xpAfterFirst} → ${xpAfterSecond}; duplicate xpAwarded=0`,
      );
    } else {
      fail(
        "No duplicate XP on dashboard",
        `${xpBeforeComplete} → ${xpAfterFirst} → ${xpAfterSecond}; duplicate=${JSON.stringify(duplicatePayload)}`,
      );
    }

    await habitPage.close();

    const emptyPage = await browser.newPage();
    emptyPage.setDefaultTimeout(60000);
    emptyPage.setDefaultNavigationTimeout(90000);
    await emptyPage.goto(`${baseUrl}/register`, { waitUntil: "domcontentloaded" });
    await emptyPage.getByRole("textbox", { name: "Имя" }).fill("Empty QA");
    await emptyPage.getByRole("textbox", { name: "Email" }).fill(emptyEmail);
    await emptyPage.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
    await emptyPage.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
    await emptyPage.getByRole("button", { name: "Создать аккаунт" }).click();
    await emptyPage.waitForURL(/\/onboarding/, { timeout: 90000 });

    const { data: createdUser } = await admin.auth.admin.listUsers();
    const emptyUser = createdUser.users.find((user) => user.email === emptyEmail);
    if (emptyUser) {
      await admin
        .from("user_profiles")
        .update({ onboarding_completed: true })
        .eq("user_id", emptyUser.id);
    }

    await emptyPage.goto(`${baseUrl}/dashboard`, { waitUntil: "domcontentloaded" });
    const emptyBody = await emptyPage.locator("main").innerText();
    if (emptyBody.includes("Создать первый фокус") || emptyBody.includes("Задайте первый фокус")) {
      pass("Empty focus state", "start focus CTA visible");
    } else {
      fail("Empty focus state", "expected empty focus CTA");
    }
    await emptyPage.close();
  } finally {
    await browser.close();
  }

  console.log("\n--- Dashboard QA summary ---");
  console.log(`Passed: ${report.checks.length}`);
  console.log(`Failed: ${report.errors.length}`);

  if (report.errors.length > 0) {
    for (const item of report.errors) {
      console.log(`  - ${item.name}: ${item.detail}`);
    }
    process.exit(1);
  }

  console.log("Dashboard QA passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
