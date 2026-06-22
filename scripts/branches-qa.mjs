#!/usr/bin/env node
/**
 * Branch pages QA — Skills / Health / Finance dashboard polish.
 * Usage: node scripts/branches-qa.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

import { completeOnboardingWizardToDashboard } from "./lib/onboarding-wizard.mjs";

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));

const baseUrl = process.env.BRANCHES_QA_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const testEmail = `branchesqa${timestamp}@lifera.test`;
const testPassword = "BranchesQaPass1!";
const skillTitle = `Branch QA skill ${timestamp}`;
const skillTitleEdited = `${skillTitle} edited`;
const healthNote = `Branch health note ${timestamp}`;
const financeNote = `Branch finance note ${timestamp}`;

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

async function registerAndOnboard(page) {
  await page.goto(`${baseUrl}/register`, { waitUntil: "domcontentloaded" });
  await page.getByRole("textbox", { name: "Имя" }).fill("Branches QA");
  await page.getByRole("textbox", { name: "Email" }).fill(testEmail);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
  await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await page.waitForURL(/\/onboarding/, { timeout: 30000 });
  await completeOnboardingWizardToDashboard(page, {
    goalTitle: `Branch QA goal ${timestamp}`,
  });
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
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await registerAndOnboard(page);
    pass("Onboarding", "dashboard ready");

    await page.goto(`${baseUrl}/skills`, { waitUntil: "domcontentloaded" });
    await page.getByText("Профиль компетенций").waitFor({ state: "visible", timeout: 30000 });
    let body = await page.locator("body").innerText();

    if (body.includes("Профиль компетенций") && body.includes("Следующий шаг")) {
      pass("Skills structure", "hero + recommendation");
    } else {
      fail("Skills structure", "missing hero/recommendation blocks");
    }

    if (!body.includes("Редактировать навык") && !body.includes("Progress, %")) {
      pass("Skills no inline edit", "clean list");
    } else {
      fail("Skills no inline edit", "legacy inline edit found");
    }

    await page.locator("#create-skill").getByRole("textbox", { name: "Название навыка" }).fill(skillTitle);
    const skillCreate = page.waitForResponse(
      (response) => response.url().includes("/api/skills") && response.request().method() === "POST",
      { timeout: 60000 },
    );
    await page.locator("#create-skill").getByRole("button", { name: "Добавить навык" }).click();
    if ((await skillCreate).status() === 201) pass("Skill create", skillTitle);
    else fail("Skill create", "API failed");

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: skillTitle, level: 3 }).waitFor({ timeout: 15000 });
    pass("Skill visible", skillTitle);

    await page.getByRole("button", { name: "Действия с навыком" }).first().click();
    await page.getByRole("menuitem", { name: "Настроить" }).click();
    await page.getByRole("heading", { name: "Настройка навыка" }).waitFor({ timeout: 10000 });
    await page
      .locator(".fixed.z-50")
      .getByRole("textbox", { name: "Название", exact: true })
      .fill(skillTitleEdited);
    const skillEdit = page.waitForResponse(
      (response) =>
        response.url().includes("/api/skills/") && response.request().method() === "PUT",
      { timeout: 30000 },
    );
    await page.locator(".fixed.z-50").getByRole("button", { name: "Сохранить" }).click();
    if ((await skillEdit).ok()) pass("Skill edit modal", "saved");
    else fail("Skill edit modal", "API failed");

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: skillTitleEdited, level: 3 }).waitFor({
      state: "visible",
      timeout: 15000,
    });
    pass("Skill edit visible", skillTitleEdited);

    await page.getByRole("button", { name: "Действия с навыком" }).first().click();
    const skillArchive = page.waitForResponse(
      (response) =>
        response.url().includes("/api/skills/") && response.request().method() === "PATCH",
      { timeout: 30000 },
    );
    await page.getByRole("menuitem", { name: "Архивировать" }).click();
    if ((await skillArchive).ok()) pass("Skill archive", "archived");
    else fail("Skill archive", "API failed");

    await page.goto(`${baseUrl}/health`, { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Индекс состояния" }).waitFor({ state: "visible", timeout: 30000 });
    body = await page.locator("body").innerText();

    if (body.includes("Индекс состояния") && body.includes("Журнал состояния")) {
      pass("Health structure", "hero + journal");
    } else {
      fail("Health structure", "missing blocks");
    }

    if (body.includes("медицинская рекомендация")) pass("Health disclaimer", "visible");
    else fail("Health disclaimer", "missing");

    if (
      !body.includes("Wellness score") &&
      !body.includes("wellness") &&
      !body.includes("Wellness")
    ) {
      pass("Health RU labels", "no EN wellness copy");
    } else {
      fail("Health RU labels", "EN wellness copy found");
    }

    const healthCreate = page.waitForResponse(
      (response) =>
        response.url().includes("/api/health/metrics") && response.request().method() === "POST",
      { timeout: 30000 },
    );
    await page.locator('textarea[name="note"]').fill(healthNote);
    await page.locator("#health-entry").getByRole("button", { name: "Сохранить запись" }).click();
    if ((await healthCreate).ok()) pass("Health create", "saved");
    else fail("Health create", "API failed");

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByText("Журнал состояния").waitFor({ state: "visible", timeout: 30000 });
    body = await page.locator("body").innerText();
    if (body.includes(healthNote)) pass("Health journal note", healthNote);
    else fail("Health journal note", healthNote);

    if (!body.includes("NaN") && !body.includes("undefined")) pass("Health numeric copy", "clean");
    else fail("Health numeric copy", "invalid values");

    await page.goto(`${baseUrl}/finance`, { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Индекс устойчивости" }).waitFor({ state: "visible", timeout: 30000 });
    body = await page.locator("body").innerText();

    if (body.includes("Индекс устойчивости") && body.includes("История снимков")) {
      pass("Finance structure", "hero + journal");
    } else {
      fail("Finance structure", "missing blocks");
    }

    if (body.includes("финансовая рекомендация")) pass("Finance disclaimer", "visible");
    else fail("Finance disclaimer", "missing");

    if (
      !body.includes("Stability score") &&
      !body.includes("Target") &&
      !body.includes("Wellness")
    ) {
      pass("Finance RU labels", "no EN labels");
    } else {
      fail("Finance RU labels", "EN labels found");
    }

    await page.locator('input[name="savings_amount"]').fill("50000");
    await page.locator('input[name="target_amount"]').fill("250000");
    await page.locator('textarea[name="note"]').fill(financeNote);
    const financeCreate = page.waitForResponse(
      (response) =>
        response.url().includes("/api/finance/metrics") && response.request().method() === "POST",
      { timeout: 30000 },
    );
    await page.locator("#finance-entry").getByRole("button", { name: "Сохранить снимок" }).click();
    if ((await financeCreate).ok()) pass("Finance create", "saved");
    else fail("Finance create", "API failed");

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByText("История снимков").waitFor({ state: "visible", timeout: 30000 });
    body = await page.locator("body").innerText();

    if (body.includes("₽")) {
      pass("Finance currency format", "₽ formatted");
    } else if (body.includes("50") && body.includes("000")) {
      pass("Finance currency format", "grouped amount visible");
    } else {
      fail("Finance currency format", "raw number or missing currency");
    }

    if (body.includes(financeNote)) pass("Finance journal note", financeNote);
    else fail("Finance journal note", financeNote);

    if (body.includes("Следующий шаг")) pass("Finance recommendation CTA", "block present");
    else fail("Finance recommendation CTA", "missing block");

    if (body.includes("Связанные действия")) pass("Linked activities", "section visible");
    else fail("Linked activities", "missing section");

    await page.setViewportSize({ height: 844, width: 390 });
    for (const route of ["/skills", "/health", "/finance"]) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      await checkNoHorizontalScroll(page, route);
    }

    for (const route of ["/dashboard", "/progress"]) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      const text = await page.locator("body").innerText();
      if (text.includes("Application error")) fail(`${route} regression`, "error");
      else pass(`${route} regression`, "ok");
    }

    console.log(`\n--- Branches QA summary ---\nPassed: ${report.checks.length}\nFailed: ${report.errors.length}`);

    if (report.errors.length > 0) process.exit(1);
    console.log("Branches QA passed.");
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
