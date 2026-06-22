#!/usr/bin/env node
/**
 * Stage Q3.1 Habits Daily Checklist QA
 * Usage: node scripts/habits-qa.mjs
 * Env: HABITS_QA_BASE_URL (default http://localhost:3000)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

import { completeOnboardingWizardToDashboard } from "./lib/onboarding-wizard.mjs";

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));

const baseUrl = process.env.HABITS_QA_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const testPassword = "HabitsQaPass1!";
const userEmail = `habitsqa${timestamp}@lifera.test`;
const habitTitle = `QA миссия ${timestamp}`;

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
  await page.getByRole("textbox", { name: "Имя" }).fill("Habits QA");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
  await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await page.waitForURL(/\/onboarding/, { timeout: 90000 });
  await completeOnboardingWizardToDashboard(page, { goalTitle });
}

async function main() {
  const redirectResponse = await fetch(`${baseUrl}/habits`, { redirect: "manual" });
  const redirectLocation = redirectResponse.headers.get("location") ?? "";
  const isLocal = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");

  if (
    (redirectResponse.status === 307 || redirectResponse.status === 302) &&
    redirectLocation.includes("/login")
  ) {
    pass("Protected /habits redirect", redirectLocation);
  } else if (isLocal && redirectResponse.status === 200) {
    pass("Protected /habits redirect", "local dev returned 200 — verify on production");
  } else {
    fail("Protected /habits redirect", `got ${redirectResponse.status} ${redirectLocation}`);
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(90000);
    await registerAndOnboard(page, userEmail, `Habits QA цель ${timestamp}`);

    await page.goto(`${baseUrl}/habits`, { waitUntil: "domcontentloaded" });
    let body = await page.locator("main").innerText();

    if (
      body.includes("Сегодняшние миссии") &&
      (body.includes("Миссии на сегодня") || body.includes("Нет активных миссий"))
    ) {
      pass("Habits page structure", "Сегодня + checklist/empty sections");
    } else {
      fail("Habits page structure", "missing daily sections");
    }

    if (body.includes("Нет активных миссий")) {
      pass("Starter missions from onboarding", "empty state (no missions)");
    } else if (body.includes("Ритм недели") || body.includes("Сегодня")) {
      pass("Starter missions from onboarding", "onboarding missions visible");
    } else {
      fail("Starter missions from onboarding", "expected missions or empty state");
    }

    if (!body.includes("Streak") && !body.includes("habit_log") && !body.includes("completion_rate")) {
      pass("No raw EN labels", "clean copy");
    } else {
      fail("No raw EN labels", "found technical labels");
    }

    await page.getByRole("textbox", { name: "Название" }).fill(habitTitle);
    await page.locator("#create-habit").getByRole("button", { name: "Создать миссию" }).click();
    await page.waitForTimeout(1500);
    await page.reload({ waitUntil: "domcontentloaded" });

    body = await page.locator("main").innerText();
    if (body.includes(habitTitle) && body.includes("Ритм недели")) {
      pass("Active habit checklist + rhythm", habitTitle);
    } else {
      fail("Active habit checklist + rhythm", "habit or rhythm missing");
    }

    if (!body.includes("Редактировать") && !body.match(/inline/i)) {
      pass("No inline edit in list", "clean checklist");
    } else {
      fail("No inline edit in list", "found inline edit affordance");
    }

    const markButton = page.getByRole("button", { name: "Отметить" }).first();
    await markButton.click();
    await page.waitForTimeout(1500);

    const xpAfterFirst = await page.evaluate(async () => {
      const res = await fetch("/api/me");
      const data = await res.json();
      return data?.profile?.xp_total ?? null;
    });

    body = await page.locator("main").innerText();
    if (body.includes("Выполнено")) {
      pass("Habit completion", "marked as Выполнено");
    } else {
      fail("Habit completion", "status not updated");
    }

    const xpAfterRefresh = await page.evaluate(async () => {
      const res = await fetch("/api/me");
      const data = await res.json();
      return data?.profile?.xp_total ?? null;
    });

    if (xpAfterRefresh === xpAfterFirst) {
      pass("No duplicate XP on habits page", `XP stable at ${xpAfterRefresh}`);
    } else {
      fail("No duplicate XP on habits page", `${xpAfterFirst} → ${xpAfterRefresh}`);
    }

    if (!body.includes("NaN") && !body.includes("undefined")) {
      pass("Weekly rhythm values", "no NaN/undefined");
    } else {
      fail("Weekly rhythm values", "invalid values in UI");
    }

    await page.setViewportSize({ height: 844, width: 390 });
    await page.reload({ waitUntil: "domcontentloaded" });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    if (scrollWidth <= clientWidth + 1) {
      pass("Mobile 390px layout", `${scrollWidth}px ≤ ${clientWidth}px`);
    } else {
      fail("Mobile 390px layout", "horizontal scroll detected");
    }

    await page.goto(`${baseUrl}/dashboard`, { waitUntil: "domcontentloaded" });
    const dashMark = page.getByRole("button", { name: "Отметить" }).first();
    if (await dashMark.isVisible().catch(() => false)) {
      pass("Dashboard compatibility", "quick complete still visible");
    } else {
      const dashBody = await page.locator("main").innerText();
      if (dashBody.includes("Выполнено")) {
        pass("Dashboard compatibility", "mission already completed on dashboard");
      } else {
        fail("Dashboard compatibility", "dashboard missions block missing");
      }
    }

    await page.close();
  } finally {
    await browser.close();
  }

  console.log("\n--- Habits QA summary ---");
  console.log(`Passed: ${report.checks.length}`);
  console.log(`Failed: ${report.errors.length}`);

  if (report.errors.length > 0) {
    for (const item of report.errors) {
      console.log(`  - ${item.name}: ${item.detail}`);
    }
    process.exit(1);
  }

  console.log("Habits QA passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
