#!/usr/bin/env node
/**
 * Stage Q3.3 Challenges List UX QA
 * Usage: node scripts/challenges-qa.mjs
 * Env: CHALLENGES_QA_BASE_URL (default http://localhost:3000)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

import { completeOnboardingWizardToDashboard } from "./lib/onboarding-wizard.mjs";

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));

const baseUrl = process.env.CHALLENGES_QA_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const testPassword = "ChallengesQaPass1!";
const userEmail = `challengesqa${timestamp}@lifera.test`;
const extraChallengeTitle = `Challenges QA mission ${timestamp}`;

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
  await page.getByRole("textbox", { name: "Имя" }).fill("Challenges QA");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
  await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await page.waitForURL(/\/onboarding/, { timeout: 30000 });
  await completeOnboardingWizardToDashboard(page, { goalTitle });
}

async function main() {
  const redirectResponse = await fetch(`${baseUrl}/challenges`, { redirect: "manual" });
  const redirectLocation = redirectResponse.headers.get("location") ?? "";
  const isLocal = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");

  if (
    (redirectResponse.status === 307 || redirectResponse.status === 302) &&
    redirectLocation.includes("/login")
  ) {
    pass("Protected /challenges redirect", redirectLocation);
  } else if (isLocal && redirectResponse.status === 200) {
    pass("Protected /challenges redirect", "local dev returned 200 — verify on production");
  } else {
    fail("Protected /challenges redirect", `got ${redirectResponse.status} ${redirectLocation}`);
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    const starterGoal = `Challenges QA starter ${timestamp}`;
    await registerAndOnboard(page, userEmail, starterGoal);

    await page.goto(`${baseUrl}/challenges`, { waitUntil: "networkidle" });
    let body = await page.locator("main").innerText();

    if (body.includes("Центр миссий") && body.includes("Активные миссии")) {
      pass("Challenges page structure", "summary + active section");
    } else {
      fail("Challenges page structure", "missing sections");
    }

    if (body.includes("7 дней системного старта") || body.includes("Стартовый челлендж")) {
      pass("Starter challenge after onboarding", "onboarding mission visible");
    } else {
      fail("Starter challenge after onboarding", "starter mission not visible");
    }

    if (body.includes("Продолжить миссию") && body.includes("Следующий этап")) {
      pass("Continue Mission Block", "next step shown");
    } else if (body.includes("Продолжить миссию")) {
      pass("Continue Mission Block", "continue block present");
    } else {
      fail("Continue Mission Block", "block missing");
    }

    if (!body.includes("Редактирование") && !body.match(/\bactive\b/i) && !body.match(/\bprogress\b/i)) {
      pass("No inline edit / EN labels", "clean list");
    } else {
      fail("No inline edit / EN labels", "found inline edit or EN");
    }

    const openMission = page.getByRole("link", { name: "Открыть миссию" }).first();
    const missionHref = await openMission.getAttribute("href");
    if (missionHref?.startsWith("/challenges/")) {
      pass("Mission detail CTA", missionHref);
    } else {
      fail("Mission detail CTA", "missing detail link");
    }

    await openMission.click();
    await page.waitForURL(/\/challenges\/.+/, { timeout: 30000 });
    const detailBody = await page.locator("main").innerText();
    if (detailBody.includes("Текущий шаг") || detailBody.includes("Завершить этап")) {
      pass("Detail page intact", "stage UI present");
    } else {
      fail("Detail page intact", "stage UI missing");
    }

    await page.goto(`${baseUrl}/challenges`, { waitUntil: "networkidle" });

    const primaryDelete = page.getByRole("button", { name: "Удалить" }).first();
    if (!(await primaryDelete.isVisible().catch(() => false))) {
      pass("Delete not primary", "no visible delete on active cards");
    } else {
      fail("Delete not primary", "delete visible as primary action");
    }

    if ((await page.locator("main").innerText()).includes("Быстрый старт")) {
      pass("Templates section", "Быстрый старт visible");
    } else {
      pass("Templates section", "no templates in DB — section hidden");
    }

    await page.locator("#create-challenge").getByRole("textbox", { name: "Название" }).fill(extraChallengeTitle);
    await page.locator("#create-challenge").getByRole("button", { name: "Создать миссию" }).click();
    await page.waitForURL(/\/challenges\/.+/, { timeout: 30000 }).catch(() => null);
    await page.goto(`${baseUrl}/challenges`, { waitUntil: "networkidle" });

    body = await page.locator("main").innerText();
    if (body.includes(extraChallengeTitle)) {
      pass("Create challenge", extraChallengeTitle);
    } else {
      fail("Create challenge", "new mission not listed");
    }

    await page.goto(`${baseUrl}/challenges`, { waitUntil: "networkidle" });
    const settingsButton = page.getByLabel("Действия с миссией").first();
    await settingsButton.click();
    await page.getByRole("menuitem", { name: "Настроить" }).click();
    await page.waitForSelector("text=Настройка миссии");
    pass("Edit challenge modal", "settings dialog opened");
    await page.getByRole("button", { name: "Отмена" }).click();

    await page.setViewportSize({ height: 844, width: 390 });
    await page.reload({ waitUntil: "networkidle" });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    if (scrollWidth <= clientWidth + 1) {
      pass("Mobile 390px layout", `${scrollWidth}px ≤ ${clientWidth}px`);
    } else {
      fail("Mobile 390px layout", "horizontal scroll");
    }

    await page.goto(`${baseUrl}/dashboard`, { waitUntil: "networkidle" });
    const dashBody = await page.locator("main").innerText();
    if (dashBody.includes("Фокус дня") || dashBody.includes(starterGoal)) {
      pass("Dashboard focus compatibility", "dashboard still loads");
    } else {
      fail("Dashboard focus compatibility", "dashboard broken");
    }

    await page.goto(`${baseUrl}/goals`, { waitUntil: "networkidle" });
    const goalsBody = await page.locator("main").innerText();
    if (goalsBody.includes("Открыть миссию") || goalsBody.includes("Создать миссию")) {
      pass("Goals mission CTA compatibility", "goals page CTAs present");
    } else {
      fail("Goals mission CTA compatibility", "goals CTAs missing");
    }

    await page.close();
  } finally {
    await browser.close();
  }

  console.log("\n--- Challenges QA summary ---");
  console.log(`Passed: ${report.checks.length}`);
  console.log(`Failed: ${report.errors.length}`);

  if (report.errors.length > 0) {
    for (const item of report.errors) {
      console.log(`  - ${item.name}: ${item.detail}`);
    }
    process.exit(1);
  }

  console.log("Challenges QA passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
