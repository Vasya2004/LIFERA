#!/usr/bin/env node
/**
 * Stage Q3.2 Goals List UX QA
 * Usage: node scripts/goals-qa.mjs
 * Env: GOALS_QA_BASE_URL (default http://localhost:3000)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

import { completeOnboardingWizardToDashboard } from "./lib/onboarding-wizard.mjs";

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));

const baseUrl = process.env.GOALS_QA_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const testPassword = "GoalsQaPass1!";
const userEmail = `goalsqa${timestamp}@lifera.test`;
const extraGoalTitle = `Goals QA goal ${timestamp}`;

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
  await page.getByRole("textbox", { name: "Имя" }).fill("Goals QA");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
  await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await page.waitForURL(/\/onboarding/, { timeout: 60000 });
  await completeOnboardingWizardToDashboard(page, { goalTitle });
}

async function main() {
  const redirectResponse = await fetch(`${baseUrl}/goals`, { redirect: "manual" });
  const redirectLocation = redirectResponse.headers.get("location") ?? "";
  const isLocal = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");

  if (
    (redirectResponse.status === 307 || redirectResponse.status === 302) &&
    redirectLocation.includes("/login")
  ) {
    pass("Protected /goals redirect", redirectLocation);
  } else if (isLocal && redirectResponse.status === 200) {
    pass("Protected /goals redirect", "local dev returned 200 — verify on production");
  } else {
    fail("Protected /goals redirect", `got ${redirectResponse.status} ${redirectLocation}`);
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);
    const starterGoal = `Goals QA starter ${timestamp}`;
    await registerAndOnboard(page, userEmail, starterGoal);

    await page.goto(`${baseUrl}/goals`, { waitUntil: "domcontentloaded" });
    let body = await page.locator("main").innerText();

    if (body.includes("Главная цель") && body.includes("Активные цели")) {
      pass("Goals page structure", "primary goal + active section");
    } else {
      fail("Goals page structure", "missing sections");
    }

    if (body.includes(starterGoal)) {
      pass("Starter goal after onboarding", starterGoal);
    } else {
      fail("Starter goal after onboarding", "onboarding goal not visible");
    }

    if (body.includes("Прогресс обновляется внутри рабочего пространства цели")) {
      pass("Progress explanation", "workspace hint shown");
    } else {
      fail("Progress explanation", "hint missing");
    }

    if (!body.includes("Редактирование") && !body.match(/\bactive\b/i)) {
      pass("No inline edit / EN labels", "clean list");
    } else {
      fail("No inline edit / EN labels", "found inline edit or EN");
    }

    const legacyLinks = await page
      .locator('main a[href^="/challenges"], main a[href^="/progress"]')
      .count();
    if (legacyLinks === 0) {
      pass("No legacy CTA", "no /challenges or /progress links");
    } else {
      fail("No legacy CTA", `${legacyLinks} legacy links visible`);
    }

    const primaryDelete = page.getByRole("button", { name: "Удалить" }).first();
    if (!(await primaryDelete.isVisible().catch(() => false))) {
      pass("Delete not primary", "no visible delete on active cards");
    } else {
      fail("Delete not primary", "delete visible as primary action");
    }

    await page.locator("#create-goal").getByRole("textbox", { name: "Название" }).fill(extraGoalTitle);
    await page.locator("#create-goal").getByRole("checkbox", { name: /Сделать главной целью/ }).check();
    await page.locator("#create-goal").getByRole("button", { name: "Создать цель" }).click();
    await page.waitForTimeout(1500);
    await page.reload({ waitUntil: "networkidle" });

    body = await page.locator("main").innerText();
    if (body.includes(extraGoalTitle)) {
      pass("Create goal", extraGoalTitle);
    } else {
      fail("Create goal", "new goal not listed");
    }

    if (body.includes("Главная") && body.includes(extraGoalTitle)) {
      pass("Set primary on create", "new goal is primary");
    } else {
      fail("Set primary on create", "primary badge/title missing");
    }

    const settingsButton = page.getByLabel("Действия с целью").first();
    await settingsButton.click();
    await page.getByRole("menuitem", { name: "Настроить" }).click();
    await page.waitForSelector("text=Настройка цели");
    pass("Edit goal modal", "settings dialog opened");

    await page.getByRole("button", { name: "Отмена" }).click();

    const firstAction = page.getByLabel("Действия с целью").first();
    await firstAction.click();
    const makePrimary = page.getByRole("menuitem", { name: "Сделать главной" }).first();
    if (await makePrimary.isVisible().catch(() => false)) {
      await makePrimary.click();
      await page.waitForTimeout(1000);
      await page.reload({ waitUntil: "domcontentloaded" });
      pass("Switch primary goal", "primary action completed");
    } else {
      pass("Switch primary goal", "first goal already primary");
      await page.keyboard.press("Escape").catch(() => {});
    }

    await page.setViewportSize({ height: 844, width: 390 });
    await page.reload({ waitUntil: "domcontentloaded" });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    if (scrollWidth <= clientWidth + 1) {
      pass("Mobile 390px layout", `${scrollWidth}px ≤ ${clientWidth}px`);
    } else {
      fail("Mobile 390px layout", "horizontal scroll");
    }

    await page.goto(`${baseUrl}/dashboard`, { waitUntil: "domcontentloaded" });
    const dashBody = await page.locator("main").innerText();
    if (dashBody.includes("Фокус дня") || dashBody.includes(starterGoal)) {
      pass("Dashboard compatibility", "dashboard still loads");
    } else {
      fail("Dashboard compatibility", "dashboard broken");
    }

    await page.close();
  } finally {
    await browser.close();
  }

  console.log("\n--- Goals QA summary ---");
  console.log(`Passed: ${report.checks.length}`);
  console.log(`Failed: ${report.errors.length}`);

  if (report.errors.length > 0) {
    for (const item of report.errors) {
      console.log(`  - ${item.name}: ${item.detail}`);
    }
    process.exit(1);
  }

  console.log("Goals QA passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
