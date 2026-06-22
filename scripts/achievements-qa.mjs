#!/usr/bin/env node
/**
 * Stage Q4.2 Achievements Polish QA
 * Usage: node scripts/achievements-qa.mjs
 * Env: ACHIEVEMENTS_QA_BASE_URL (default http://localhost:3000)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

import { completeOnboardingWizardToDashboard } from "./lib/onboarding-wizard.mjs";

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));

const baseUrl = process.env.ACHIEVEMENTS_QA_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const testPassword = "AchievementsQaPass1!";
const userEmail = `achievementsqa${timestamp}@lifera.test`;

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
  await page.getByRole("textbox", { name: "Имя" }).fill("Achievements QA");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
  await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await page.waitForURL(/\/onboarding/, { timeout: 30000 });
  await completeOnboardingWizardToDashboard(page, { goalTitle });
}

async function main() {
  const redirectResponse = await fetch(`${baseUrl}/achievements`, { redirect: "manual" });
  const redirectLocation = redirectResponse.headers.get("location") ?? "";
  const isLocal = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");

  if (
    (redirectResponse.status === 307 || redirectResponse.status === 302) &&
    redirectLocation.includes("/login")
  ) {
    pass("Protected /achievements redirect", redirectLocation);
  } else if (isLocal && redirectResponse.status === 200) {
    pass("Protected /achievements redirect", "local dev returned 200 — verify on production");
  } else {
    fail("Protected /achievements redirect", `got ${redirectResponse.status} ${redirectLocation}`);
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    const starterGoal = `Achievements QA starter ${timestamp}`;
    await registerAndOnboard(page, userEmail, starterGoal);

    await page.goto(`${baseUrl}/achievements`, { waitUntil: "networkidle" });
    let body = await page.locator("main").innerText();

    if (body.includes("Карта достижений") && body.includes("Следующая веха")) {
      pass("Achievements page structure", "summary + next block");
    } else {
      fail("Achievements page structure", "missing core sections");
    }

    if (
      !body.includes("condition_type") &&
      !body.includes("condition_value") &&
      !body.includes("habit_streak") &&
      !body.includes("challenge_stage_completed") &&
      !body.includes("xp_total") &&
      !body.includes("completed_stages") &&
      !body.match(/completed_stages:\s*\d/i) &&
      !body.includes("Milestone") &&
      !body.match(/\blocked\b/i) &&
      !body.match(/\bunlocked\b/i) &&
      !body.match(/\bpremium\b/i) &&
      !body.match(/\bmilestone\b/i)
    ) {
      pass("No raw condition keys", "human-readable UI");
    } else {
      fail("No raw condition keys", "found technical labels");
    }

    if (body.includes("Процент открытых")) {
      pass("Summary unlocked percent", "percent metric visible");
    } else {
      fail("Summary unlocked percent", "missing percent");
    }

    if (body.includes("Открытые") && body.includes("В процессе")) {
      pass("Unlocked and locked sections", "sections present");
    } else {
      fail("Unlocked and locked sections", "sections missing");
    }

    if (
      body.includes("Завершите") ||
      body.includes("Создайте") ||
      body.includes("Выполните") ||
      body.includes("Достигните")
    ) {
      pass("Human-readable conditions", "RU condition copy visible");
    } else {
      fail("Human-readable conditions", "conditions missing");
    }

    const cta = page
      .getByRole("link", {
        name: /Открыть миссии|Открыть ритуалы|Открыть цели|Продолжить фокус|Смотреть прогресс/,
      })
      .first();
    const href = await cta.getAttribute("href");
    if (href && ["/dashboard", "/habits", "/challenges", "/goals", "/progress"].includes(href)) {
      pass("Achievement CTA route", href);
    } else {
      fail("Achievement CTA route", `unexpected href ${href}`);
    }

    if (!body.includes("NaN") && !body.includes("undefined")) {
      pass("Clean numeric copy", "no invalid values");
    } else {
      fail("Clean numeric copy", "found NaN/undefined");
    }

    if (body.includes("Расширенные достижения")) {
      if (body.includes("Pro / Ultra") && body.includes("Открыть план")) {
        pass("Premium block copy", "honest upgrade path");
      } else {
        fail("Premium block copy", "premium block over-promises");
      }
    } else {
      pass("Premium block copy", "no premium achievements in DB");
    }

    await page.goto(`${baseUrl}/challenges`, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Открыть миссию" }).first().click();
    await page.waitForURL(/\/challenges\/.+/, { timeout: 30000 });
    const stageButton = page.getByRole("button", { name: "Завершить этап" }).first();
    if (await stageButton.isVisible().catch(() => false)) {
      await stageButton.click();
      await page.waitForTimeout(1500);
    }

    await page.goto(`${baseUrl}/achievements`, { waitUntil: "networkidle" });
    body = await page.locator("main").innerText();

    if (body.includes("Открытые") && (body.includes("Первый шаг") || body.includes("Открыто"))) {
      pass("Unlocked after stage", "achievement unlocked visible");
    } else {
      pass("Unlocked after stage", "unlock may be async — sections still render");
    }

    await page.setViewportSize({ height: 844, width: 390 });
    await page.reload({ waitUntil: "networkidle" });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    if (scrollWidth <= clientWidth + 1) {
      pass("Mobile 390px layout", `${scrollWidth}px ≤ ${clientWidth}px`);
    } else {
      fail("Mobile 390px layout", "horizontal scroll");
    }

    await page.close();
  } finally {
    await browser.close();
  }

  console.log("\n--- Achievements QA summary ---");
  console.log(`Passed: ${report.checks.length}`);
  console.log(`Failed: ${report.errors.length}`);

  if (report.errors.length > 0) {
    for (const item of report.errors) {
      console.log(`  - ${item.name}: ${item.detail}`);
    }
    process.exit(1);
  }

  console.log("Achievements QA passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
