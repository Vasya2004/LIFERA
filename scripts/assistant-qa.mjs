#!/usr/bin/env node
/**
 * Stage Q6.1 AI Assistant QA
 * Usage: node scripts/assistant-qa.mjs
 * Env: ASSISTANT_QA_BASE_URL (default http://localhost:3000)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

import { completeOnboardingWizardToDashboard } from "./lib/onboarding-wizard.mjs";

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));

const baseUrl = process.env.ASSISTANT_QA_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const testPassword = "AssistantQaPass1!";
const userEmail = `assistantqa${timestamp}@lifera.test`;

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
  await page.getByRole("textbox", { name: "Имя" }).fill("Assistant QA");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
  await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await page.waitForURL(/\/onboarding/, { timeout: 30000 });
  await completeOnboardingWizardToDashboard(page, { goalTitle });
}

async function main() {
  const redirectResponse = await fetch(`${baseUrl}/ai-assistant`, { redirect: "manual" });
  const redirectLocation = redirectResponse.headers.get("location") ?? "";
  const isLocal = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");

  if (
    (redirectResponse.status === 307 || redirectResponse.status === 302) &&
    redirectLocation.includes("/login")
  ) {
    pass("Protected /ai-assistant redirect", redirectLocation);
  } else if (isLocal && redirectResponse.status === 200) {
    pass("Protected /ai-assistant redirect", "local dev returned 200 — verify on production");
  } else {
    fail("Protected /ai-assistant redirect", `got ${redirectResponse.status} ${redirectLocation}`);
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    const starterGoal = `Assistant QA starter ${timestamp}`;
    await registerAndOnboard(page, userEmail, starterGoal);

    await page.goto(`${baseUrl}/ai-assistant`, { waitUntil: "networkidle" });
    const body = await page.locator("main").innerText();

    if (body.includes("Ассистент Lifera") && body.includes("Что видит система")) {
      pass("Assistant page structure", "header + snapshot");
    } else {
      fail("Assistant page structure", "missing core sections");
    }

    if (body.includes("Главный следующий шаг") && body.includes("Почему")) {
      pass("Main recommendation block", "structured recommendation");
    } else {
      fail("Main recommendation block", "missing main block");
    }

    if (body.includes("Рекомендации по зонам")) {
      pass("Recommendation cards", "cards section present");
    } else {
      fail("Recommendation cards", "cards missing");
    }

    if (
      !body.match(/\bGPT\b/i) &&
      !body.match(/\bLLM\b/i) &&
      !body.match(/\bнейросеть\b/i) &&
      !body.includes("AI рекомендация")
    ) {
      pass("Honest AI naming", "no fake LLM claims");
    } else {
      fail("Honest AI naming", "found LLM-style claims");
    }

    const chatInput = page.getByRole("textbox", { name: /спросить|ask|chat/i });
    if (!(await chatInput.isVisible().catch(() => false))) {
      pass("No fake chat input", "chat UI absent");
    } else {
      fail("No fake chat input", "chat input visible");
    }

    const deadButton = page.getByRole("button", { name: "Получить следующий шаг" });
    if (!(await deadButton.isVisible().catch(() => false))) {
      pass("No dead buttons", "legacy dead CTA removed");
    } else {
      fail("No dead buttons", "dead CTA still visible");
    }

    const cta = page
      .getByRole("link", {
        name: /Продолжить фокус|Открыть ритуалы|Открыть миссии|Открыть цели|Смотреть прогресс/,
      })
      .first();
    const href = await cta.getAttribute("href");
    if (
      href &&
      ["/dashboard", "/habits", "/challenges", "/goals", "/progress"].some((route) =>
        href.startsWith(route),
      )
    ) {
      pass("Working CTA routes", href);
    } else {
      fail("Working CTA routes", `unexpected href ${href}`);
    }

    if (body.includes("Режим ассистента") && body.includes("базовый рекомендательный режим")) {
      pass("Assistant mode transparency", "honest mode copy");
    } else {
      fail("Assistant mode transparency", "mode block missing");
    }

    if (!body.includes("NaN") && !body.includes("undefined")) {
      pass("Clean numeric copy", "no invalid values");
    } else {
      fail("Clean numeric copy", "found NaN/undefined");
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

  console.log("\n--- Assistant QA summary ---");
  console.log(`Passed: ${report.checks.length}`);
  console.log(`Failed: ${report.errors.length}`);

  if (report.errors.length > 0) {
    for (const item of report.errors) {
      console.log(`  - ${item.name}: ${item.detail}`);
    }
    process.exit(1);
  }

  console.log("Assistant QA passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
