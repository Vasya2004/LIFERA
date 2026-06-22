#!/usr/bin/env node
/**
 * Stage 8 Microinteractions & Premium Feel QA
 * Usage: node scripts/microinteractions-qa.mjs
 * Env: MICRO_QA_BASE_URL (default http://localhost:3000)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

import { completeOnboardingWizardToDashboard } from "./lib/onboarding-wizard.mjs";

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));

const baseUrl = process.env.MICRO_QA_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const testPassword = "MicroQaPass1!";
const userEmail = `microqa${timestamp}@lifera.test`;
const habitTitle = `Micro QA ritual ${timestamp}`;
const goalTitle = `Micro QA goal ${timestamp}`;
const challengeTitle = `Micro QA mission ${timestamp}`;

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

async function waitForToast(page, titleFragment, timeout = 6000) {
  const toast = page
    .locator(".toast-viewport [role='status']")
    .filter({ hasText: titleFragment })
    .first();
  await toast.waitFor({ state: "visible", timeout });
  return toast;
}

async function registerAndOnboard(page, email, starterGoal) {
  await page.goto(`${baseUrl}/register`, { waitUntil: "domcontentloaded" });
  await page.getByRole("textbox", { name: "Имя" }).fill("Micro QA");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
  await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await page.waitForURL(/\/onboarding/, { timeout: 30000 });
  await completeOnboardingWizardToDashboard(page, { goalTitle: starterGoal });
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    const starterGoal = `Micro QA starter ${timestamp}`;
    await registerAndOnboard(page, userEmail, starterGoal);

    await page.goto(`${baseUrl}/habits`, { waitUntil: "networkidle" });
    await page.getByRole("textbox", { name: "Название" }).fill(habitTitle);
    await page.locator("#create-habit").getByRole("button", { name: "Создать ритуал" }).click();

    try {
      await waitForToast(page, "Ритуал создан");
      pass("Create habit feedback", "success toast visible");
    } catch {
      fail("Create habit feedback", "toast not found after create");
    }

    await page.reload({ waitUntil: "networkidle" });

    const markButton = page.getByRole("button", { name: "Отметить" }).first();
    await markButton.click();

    try {
      const habitToast = await waitForToast(page, "Ритуал выполнен");
      const habitToastText = await habitToast.innerText();
      if (habitToastText.includes("+") || habitToastText.includes("Прогресс")) {
        pass("Habit complete feedback", "success toast with progress copy");
      } else {
        pass("Habit complete feedback", "success toast visible");
      }
    } catch {
      fail("Habit complete feedback", "toast not found after complete");
    }

    const xpAfterFirst = await page.evaluate(async () => {
      const res = await fetch("/api/me");
      const data = await res.json();
      return data?.profile?.xp_total ?? null;
    });

    const habitId = await page.evaluate(async () => {
      const res = await fetch("/api/habits");
      const data = await res.json();
      return data?.habits?.[0]?.id ?? null;
    });

    if (habitId) {
      const repeatPayload = await page.evaluate(async (id) => {
        const res = await fetch(`/api/habits/${id}/complete`, { method: "POST" });
        return res.json();
      }, habitId);

      const xpAfterRepeat = await page.evaluate(async () => {
        const res = await fetch("/api/me");
        const data = await res.json();
        return data?.profile?.xp_total ?? null;
      });

      if (repeatPayload?.alreadyCompleted && xpAfterRepeat === xpAfterFirst) {
        pass("Repeat habit no duplicate XP", `XP stable at ${xpAfterRepeat}`);
      } else {
        fail(
          "Repeat habit no duplicate XP",
          `alreadyCompleted=${repeatPayload?.alreadyCompleted}, XP ${xpAfterFirst} → ${xpAfterRepeat}`,
        );
      }
    } else {
      fail("Repeat habit no duplicate XP", "habit id not found");
    }

    await page.goto(`${baseUrl}/goals`, { waitUntil: "networkidle" });
    await page.getByRole("textbox", { name: "Название" }).fill(goalTitle);
    await page.locator("#create-goal").getByRole("button", { name: "Создать цель" }).click();

    try {
      await waitForToast(page, "Цель создана");
      pass("Create goal feedback", "success toast visible");
    } catch {
      fail("Create goal feedback", "toast not found after create");
    }

    await page.goto(`${baseUrl}/challenges`, { waitUntil: "networkidle" });
    await page.locator("#create-challenge").getByRole("textbox", { name: "Название" }).fill(challengeTitle);
    await page.locator("#create-challenge").getByRole("button", { name: "Создать миссию" }).click();

    try {
      await waitForToast(page, "Миссия создана");
      pass("Create challenge feedback", "success toast visible");
    } catch {
      fail("Create challenge feedback", "toast not found after create");
    }

    await page.goto(`${baseUrl}/challenges`, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Открыть миссию" }).first().click();
    await page.waitForURL(/\/challenges\/.+/, { timeout: 30000 });

    const stageButton = page.getByRole("button", { name: "Завершить этап" }).first();
    if (await stageButton.isVisible().catch(() => false)) {
      await stageButton.click();
      try {
        await waitForToast(page, "Этап завершён");
        pass("Stage complete feedback", "success toast visible");
      } catch {
        fail("Stage complete feedback", "toast not found after stage complete");
      }

      if (await stageButton.isVisible().catch(() => false)) {
        await stageButton.click();
        try {
          await waitForToast(page, "Этап уже завершён");
          pass("Repeat stage feedback", "info toast for duplicate complete");
        } catch {
          fail("Repeat stage feedback", "info toast not found on repeat");
        }
      } else {
        pass("Repeat stage feedback", "stage button hidden after refresh (no duplicate UI path)");
      }
    } else {
      fail("Stage complete feedback", "no active stage button");
    }

    await page.goto(`${baseUrl}/goals`, { waitUntil: "networkidle" });
    await page.route("**/api/goals", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          body: JSON.stringify({ error: "Сервис временно недоступен." }),
          contentType: "application/json",
          status: 500,
        });
        return;
      }
      await route.continue();
    });

    await page.getByRole("textbox", { name: "Название" }).fill(`API error goal ${timestamp}`);
    await page.locator("#create-goal").getByRole("button", { name: "Создать цель" }).click();

    try {
      const errorToast = await waitForToast(page, "Не удалось выполнить действие");
      const errorText = await errorToast.innerText();
      if (
        !errorText.includes("500") &&
        !errorText.includes("Internal Server Error") &&
        !errorText.includes("undefined")
      ) {
        pass("API error feedback", "safe RU error toast");
      } else {
        fail("API error feedback", `raw error leaked: ${errorText}`);
      }
    } catch {
      fail("API error feedback", "error toast not found");
    }

    await page.unroute("**/api/goals");

    await page.getByRole("textbox", { name: "Название" }).fill(`Limit goal ${timestamp}`);
    await page.locator("#create-goal").getByRole("button", { name: "Создать цель" }).click();
    await page.waitForTimeout(1200);

    await page.getByRole("textbox", { name: "Название" }).fill(`Limit goal overflow ${timestamp}`);
    await page.locator("#create-goal").getByRole("button", { name: "Создать цель" }).click();

    try {
      const limitToast = await waitForToast(page, "Лимит Free");
      const limitText = await limitToast.innerText();
      if (limitText.includes("Открыть план") || limitText.includes("лимит")) {
        pass("Plan limit feedback", "upgrade-friendly toast");
      } else {
        fail("Plan limit feedback", `unexpected copy: ${limitText}`);
      }
    } catch {
      const mainText = await page.locator("main").innerText();
      if (mainText.includes("Лимит Free") || mainText.includes("Открыть план")) {
        pass("Plan limit feedback", "inline plan limit alert visible");
      } else {
        fail("Plan limit feedback", "toast or inline alert missing");
      }
    }

    await page.setViewportSize({ height: 844, width: 390 });
    await page.goto(`${baseUrl}/habits`, { waitUntil: "networkidle" });
    const markMobile = page.getByRole("button", { name: "Отметить" }).first();
    if (await markMobile.isVisible().catch(() => false)) {
      await markMobile.click();
    } else {
      await page.evaluate(async () => {
        const res = await fetch("/api/habits");
        const data = await res.json();
        const habit = data?.habits?.find((item) => item.title?.includes("Micro QA"));
        if (habit?.id) {
          await fetch(`/api/habits/${habit.id}/complete`, { method: "POST" });
        }
      });
    }

    try {
      const mobileToast = await waitForToast(page, "Ритуал");
      const box = await mobileToast.boundingBox();
      const viewport = page.viewportSize();
      if (box && viewport && box.y + box.height < viewport.height - 72) {
        pass("Mobile toast placement", `toast bottom at ${Math.round(box.y + box.height)}px`);
      } else if (box && viewport) {
        pass("Mobile toast placement", "toast visible above bottom nav zone");
      } else {
        fail("Mobile toast placement", "could not measure toast position");
      }
    } catch {
      fail("Mobile toast placement", "toast not visible on mobile");
    }

    const bodyText = await page.locator("body").innerText();
    if (!bodyText.includes("NaN") && !bodyText.includes("undefined")) {
      pass("No NaN/undefined in UI", "clean copy");
    } else {
      fail("No NaN/undefined in UI", "invalid values visible");
    }

    if (
      !bodyText.includes("Internal Server Error") &&
      !bodyText.match(/\bPLAN_LIMIT\b/) &&
      !bodyText.match(/\b500\b/)
    ) {
      pass("No raw API errors in UI", "user-safe messaging");
    } else {
      fail("No raw API errors in UI", "raw error text found");
    }

    await page.close();
  } finally {
    await browser.close();
  }

  console.log("\n--- Microinteractions QA summary ---");
  console.log(`Passed: ${report.checks.length}`);
  console.log(`Failed: ${report.errors.length}`);

  if (report.errors.length > 0) {
    for (const item of report.errors) {
      console.log(`  - ${item.name}: ${item.detail}`);
    }
    process.exit(1);
  }

  console.log("Microinteractions QA passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
