#!/usr/bin/env node
/**
 * Stage 6 branch modules QA — Playwright smoke test.
 * Usage: node scripts/stage6-branches-qa.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

import { completeOnboardingWizardToDashboard } from "./lib/onboarding-wizard.mjs";

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

const baseUrl = process.env.STAGE6_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const testEmail = `stage6qa${timestamp}@lifera.test`;
const testPassword = "Stage6QaPass1!";
const skillTitle = `Stage 6 QA skill ${timestamp}`;
const skillTitleEdited = `${skillTitle} edited`;
const healthNote = `Stage6 wellness note ${timestamp}`;
const financeNote = `Stage6 finance note ${timestamp}`;

const report = { checks: [], errors: [] };

function pass(name, detail) {
  report.checks.push({ name, ok: true, detail });
  console.log(`✓ ${name}: ${detail}`);
}

function fail(name, detail) {
  report.errors.push({ name, detail });
  console.log(`✗ ${name}: ${detail}`);
}

async function registerAndOnboard(page) {
  await page.goto(`${baseUrl}/register`, { waitUntil: "domcontentloaded" });
  await page.getByRole("textbox", { name: "Имя" }).fill("Stage6 QA");
  await page.getByRole("textbox", { name: "Email" }).fill(testEmail);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
  await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await page.waitForURL(/\/onboarding/, { timeout: 30000 });
  await completeOnboardingWizardToDashboard(page, {
    goalTitle: `Stage 6 goal ${timestamp}`,
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await registerAndOnboard(page);
    pass("Register + onboarding", page.url());

    await page.goto(`${baseUrl}/skills`, { waitUntil: "domcontentloaded" });
    if (page.url().includes("/skills")) pass("/skills opens", page.url());
    else fail("/skills opens", page.url());

    const skillsContent = await page.locator("body").innerText();
    if (skillsContent.includes("Application error")) fail("Skills runtime", "error boundary");
    else pass("Skills runtime", "ok");

    await page.getByRole("textbox", { name: "Название навыка" }).fill(skillTitle);
    const skillCreate = page.waitForResponse(
      (response) => response.url().includes("/api/skills") && response.request().method() === "POST",
      { timeout: 30000 },
    );
    await page.getByRole("button", { name: "Добавить навык" }).click();
    const skillResponse = await skillCreate;
    if (skillResponse.status() === 201) pass("Skill API create", "201");
    else fail("Skill API create", String(skillResponse.status()));

    const skillPayload = await skillResponse.json().catch(() => null);
    if (skillPayload?.skill?.title === skillTitle) pass("Skill create", skillTitle);
    else fail("Skill create", skillTitle);

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: skillTitle }).waitFor({ state: "visible", timeout: 15000 });
    pass("Skill visible in list", skillTitle);

    await page.locator("summary", { hasText: "Редактировать навык" }).first().click();
    await page.locator('input[name="title"]').first().fill(skillTitleEdited);
    const skillEdit = page.waitForResponse(
      (response) =>
        response.url().includes("/api/skills/") && response.request().method() === "PUT",
      { timeout: 30000 },
    );
    await page.getByRole("button", { name: "Сохранить" }).first().click();
    const skillEditResponse = await skillEdit;
    if (skillEditResponse.ok()) pass("Skill edit API", String(skillEditResponse.status()));
    else fail("Skill edit API", String(skillEditResponse.status()));

    await page.reload({ waitUntil: "domcontentloaded" });
    if (await page.getByRole("heading", { name: skillTitleEdited }).isVisible()) {
      pass("Skill edit visible", skillTitleEdited);
    } else {
      fail("Skill edit visible", skillTitleEdited);
    }

    const skillArchive = page.waitForResponse(
      (response) =>
        response.url().includes("/api/skills/") && response.request().method() === "PATCH",
      { timeout: 30000 },
    );
    await page.getByRole("button", { name: "Архивировать" }).first().click();
    const archiveResponse = await skillArchive;
    if (archiveResponse.ok()) pass("Skill archive API", String(archiveResponse.status()));
    else fail("Skill archive API", String(archiveResponse.status()));

    await page.reload({ waitUntil: "domcontentloaded" });
    const afterArchive = await page.locator("body").innerText();
    if (afterArchive.includes("Архив") && afterArchive.includes(skillTitleEdited)) {
      pass("Skill archived visible", "archived section");
    } else {
      fail("Skill archived visible", "missing archive section");
    }

    await page.goto(`${baseUrl}/health`, { timeout: 60000, waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Здоровье" }).waitFor({ state: "visible", timeout: 30000 });
    const healthContent = await page.locator("body").innerText();
    if (healthContent.includes("медицинской рекомендацией")) {
      pass("Health disclaimer", "visible");
    } else {
      fail("Health disclaimer", "missing");
    }

    const healthCreate = page.waitForResponse(
      (response) =>
        response.url().includes("/api/health/metrics") && response.request().method() === "POST",
      { timeout: 30000 },
    );
    await page.locator('textarea[name="note"]').fill(healthNote);
    await page.getByRole("button", { name: "Сохранить wellness-запись" }).click();
    const healthResponse = await healthCreate;
    if (healthResponse.ok()) pass("Health API create", String(healthResponse.status()));
    else fail("Health API create", String(healthResponse.status()));

    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Последняя запись" }).waitFor({ state: "visible", timeout: 30000 });
    const afterHealth = await page.locator("body").innerText();
    pass("Health metric create", "visible");

    if (afterHealth.includes(healthNote)) pass("Health note visible", healthNote);
    else fail("Health note visible", healthNote);

    await page.goto(`${baseUrl}/finance`, { timeout: 60000, waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Финансы" }).waitFor({ state: "visible", timeout: 30000 });
    const financeContent = await page.locator("body").innerText();
    if (financeContent.includes("финансовой рекомендацией")) {
      pass("Finance disclaimer", "visible");
    } else {
      fail("Finance disclaimer", "missing");
    }

    await page.locator('input[name="savings_amount"]').fill("10000");
    await page.locator('input[name="target_amount"]').fill("50000");
    await page.locator('textarea[name="note"]').fill(financeNote);
    const financeCreate = page.waitForResponse(
      (response) =>
        response.url().includes("/api/finance/metrics") && response.request().method() === "POST",
      { timeout: 30000 },
    );
    await page.getByRole("button", { name: "Сохранить snapshot" }).click();
    const financeResponse = await financeCreate;
    if (financeResponse.ok()) pass("Finance API create", String(financeResponse.status()));
    else fail("Finance API create", String(financeResponse.status()));

    const financePayload = await financeResponse.json().catch(() => null);
    if (financePayload?.date) pass("Finance metric create", financePayload.date);
    else fail("Finance metric create", "missing date");

    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Последний snapshot" }).waitFor({ state: "visible", timeout: 30000 });
    const afterFinance = await page.locator("body").innerText();
    if (afterFinance.includes("20%") || afterFinance.includes("10000")) {
      pass("Finance progress visible", "target progress");
    } else {
      fail("Finance progress visible", "missing progress");
    }

    if (afterFinance.includes(financeNote)) pass("Finance note visible", financeNote);
    else fail("Finance note visible", financeNote);

    for (const route of ["/progress", "/dashboard", "/goals", "/challenges", "/habits"]) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      const text = await page.locator("body").innerText();
      if (text.includes("Application error")) fail(`${route} regression`, "error");
      else pass(`${route} regression`, "ok");
    }

    await page.setViewportSize({ height: 844, width: 390 });
    for (const route of ["/skills", "/health", "/finance"]) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      if (scrollWidth <= clientWidth + 1) pass(`Mobile 390 ${route}`, "no horizontal scroll");
      else fail(`Mobile 390 ${route}`, "horizontal scroll");
    }

    fs.writeFileSync(
      path.join(root, "output/stage6-qa-report.json"),
      JSON.stringify({ ...report, finishedAt: new Date().toISOString() }, null, 2),
    );

    if (report.errors.length > 0) process.exit(1);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
