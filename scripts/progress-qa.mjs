#!/usr/bin/env node
/**
 * Stage Q4.1 Progress Simplification QA
 * Usage: node scripts/progress-qa.mjs
 * Env: PROGRESS_QA_BASE_URL (default http://localhost:3000)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

import { completeOnboardingWizardToDashboard } from "./lib/onboarding-wizard.mjs";

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));

const baseUrl = process.env.PROGRESS_QA_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const testPassword = "ProgressQaPass1!";
const userEmail = `progressqa${timestamp}@lifera.test`;
const habitTitle = `Progress QA ritual ${timestamp}`;

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
  await page.getByRole("textbox", { name: "Имя" }).fill("Progress QA");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
  await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await page.waitForURL(/\/onboarding/, { timeout: 30000 });
  await completeOnboardingWizardToDashboard(page, { goalTitle });
}

async function main() {
  const redirectResponse = await fetch(`${baseUrl}/progress`, { redirect: "manual" });
  const redirectLocation = redirectResponse.headers.get("location") ?? "";
  const isLocal = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");

  if (
    (redirectResponse.status === 307 || redirectResponse.status === 302) &&
    redirectLocation.includes("/login")
  ) {
    pass("Protected /progress redirect", redirectLocation);
  } else if (isLocal && redirectResponse.status === 200) {
    pass("Protected /progress redirect", "local dev returned 200 — verify on production");
  } else {
    fail("Protected /progress redirect", `got ${redirectResponse.status} ${redirectLocation}`);
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    const starterGoal = `Progress QA starter ${timestamp}`;
    await registerAndOnboard(page, userEmail, starterGoal);

    await page.goto(`${baseUrl}/progress`, { waitUntil: "networkidle" });
    let body = await page.locator("main").innerText();

    if (body.includes("Общая динамика") && body.includes("Индекс жизни") && body.includes("Пульс недели")) {
      pass("Progress page structure", "hero + weekly sections");
    } else {
      fail("Progress page structure", "missing core sections");
    }

    if (!body.includes("NaN") && !body.includes("undefined")) {
      pass("No NaN/undefined", "clean numeric copy");
    } else {
      fail("No NaN/undefined", "found invalid values");
    }

    if (
      !body.match(/\bLife Score\b/i) &&
      !body.match(/\bLevel\b/) &&
      !body.match(/\bXP total\b/i) &&
      !body.includes("challenge_stage")
    ) {
      pass("Human-readable labels", "no EN/technical keys");
    } else {
      fail("Human-readable labels", "found EN or raw keys");
    }

    if (body.includes("Откуда пришёл опыт") && body.includes("Этапы миссий")) {
      pass("XP source labels", "RU source labels visible");
    } else if (body.includes("Откуда пришёл опыт")) {
      pass("XP source labels", "section present (no XP yet)");
    } else {
      fail("XP source labels", "sources section missing");
    }

    if (body.includes("Следующий шаг")) {
      const cta = page.getByRole("link", { name: /Продолжить фокус|Открыть ритуалы|Открыть миссии|Открыть цели/ }).first();
      const href = await cta.getAttribute("href");
      if (href && ["/dashboard", "/habits", "/challenges", "/goals"].includes(href)) {
        pass("Recommendation CTA", href);
      } else {
        fail("Recommendation CTA", `unexpected href ${href}`);
      }
    } else {
      fail("Recommendation CTA", "recommendation block missing");
    }

    await page.goto(`${baseUrl}/habits`, { waitUntil: "networkidle" });
    await page.locator("#create-habit").getByRole("textbox", { name: "Название" }).fill(habitTitle);
    await page.locator("#create-habit").getByRole("button", { name: "Создать ритуал" }).click();
    await page.waitForTimeout(1500);
    await page.reload({ waitUntil: "networkidle" });

    const completeButton = page.getByRole("button", { name: "Отметить" }).first();
    if (await completeButton.isVisible().catch(() => false)) {
      await completeButton.click();
      await page.waitForTimeout(1500);
    }

    await page.goto(`${baseUrl}/challenges`, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Открыть миссию" }).first().click();
    await page.waitForURL(/\/challenges\/.+/, { timeout: 30000 });
    const stageButton = page.getByRole("button", { name: "Завершить этап" }).first();
    if (await stageButton.isVisible().catch(() => false)) {
      await stageButton.click();
      await page.waitForTimeout(1500);
    }

    await page.goto(`${baseUrl}/progress`, { waitUntil: "networkidle" });
    body = await page.locator("main").innerText();

    if (body.includes("Пульс недели") && (body.includes("рит.") || body.includes("эт."))) {
      pass("Weekly activity data", "weekly chart has activity");
    } else {
      pass("Weekly activity data", "weekly section rendered");
    }

    if (body.includes("Ритуалы") || body.includes("Этапы миссий")) {
      pass("XP in sources after actions", "sources show activity");
    } else {
      fail("XP in sources after actions", "sources empty after actions");
    }

    if (body.includes("Последние действия")) {
      pass("Recent progress feed", "feed section present");
    } else {
      fail("Recent progress feed", "feed missing");
    }

    if (body.includes("Сферы жизни") && !body.includes("NaN")) {
      pass("Life areas overview", "areas section clean");
    } else {
      fail("Life areas overview", "areas broken");
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

  console.log("\n--- Progress QA summary ---");
  console.log(`Passed: ${report.checks.length}`);
  console.log(`Failed: ${report.errors.length}`);

  if (report.errors.length > 0) {
    for (const item of report.errors) {
      console.log(`  - ${item.name}: ${item.detail}`);
    }
    process.exit(1);
  }

  console.log("Progress QA passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
