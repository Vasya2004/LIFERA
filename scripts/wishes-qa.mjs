#!/usr/bin/env node
/**
 * Stage 2 Wishes QA
 * Usage: node scripts/wishes-qa.mjs
 * Env: WISHES_QA_BASE_URL (default http://localhost:3000)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

import { completeOnboardingWizardToDashboard } from "./lib/onboarding-wizard.mjs";

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));

const baseUrl = process.env.WISHES_QA_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const testPassword = "WishesQaPass1!";
const userEmail = `wishesqa${timestamp}@lifera.test`;
const starterGoal = `Wishes QA goal ${timestamp}`;
const wishTitle = `MacBook QA ${timestamp}`;

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
  await page.getByRole("textbox", { name: "Имя" }).fill("Wishes QA");
  await page.getByRole("textbox", { name: "Email" }).fill(userEmail);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
  await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await page.waitForURL(/\/onboarding/, { timeout: 60000 });
  await completeOnboardingWizardToDashboard(page, { goalTitle: starterGoal });
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);
    await registerAndOnboard(page);

    await page.goto(`${baseUrl}/goals/wishes`, { waitUntil: "domcontentloaded" });
    let body = await page.locator("main").innerText();

    if (body.includes("Карта желаний") && body.includes("Желания внутри целей")) {
      pass("/goals/wishes opens", "page title + summary visible");
    } else {
      fail("/goals/wishes opens", "missing title or summary");
    }

    await page.goto(`${baseUrl}/wishes`, { waitUntil: "domcontentloaded" });
    if (page.url().includes("/goals/wishes")) {
      pass("/wishes redirect", page.url());
    } else {
      fail("/wishes redirect", page.url());
    }

    await page.locator('aside a[aria-current="page"][href="/goals"]').waitFor({ timeout: 30000 });
    pass("Sidebar active state", "Цели highlighted");

    const tabs = page.getByRole("navigation", { name: "Подменю текущего раздела" });
    await tabs.getByRole("link", { name: "Цели" }).waitFor();
    await tabs.getByRole("link", { name: "Карта желаний" }).waitFor();
    pass("Goals section tabs", "Цели / Карта желаний");

    const form = page.locator("#create-wish");
    await form.getByRole("textbox", { name: "Название" }).fill(wishTitle);
    await form.getByRole("textbox", { name: "Почему это важно" }).fill("Рабочий инструмент для роста дохода.");
    await form.getByRole("textbox", { name: "Категория" }).fill("техника");
    await form.getByLabel("Сумма цели").fill("150000");
    await form.getByLabel("Связанная цель").selectOption({ label: starterGoal });
    await form.getByRole("button", { name: "Добавить желание" }).click();
    await page.waitForTimeout(1500);
    await page.reload({ waitUntil: "domcontentloaded" });
    body = await page.locator("main").innerText();

    if (body.includes(wishTitle) && body.includes(`Связано с целью: ${starterGoal}`)) {
      pass("Create and link wish", "wish visible with linked goal");
    } else {
      fail("Create and link wish", "wish or linked goal missing");
    }

    if (body.includes("Всего желаний") && body.includes("Приобретено") && body.includes("Сумма «Хочу»") && body.includes("Связано с целями")) {
      pass("Wishes summary", "all summary metrics visible");
    } else {
      fail("Wishes summary", "summary metrics missing");
    }

    await page.getByLabel("Действия с желанием").first().click();
    await page.getByRole("button", { name: "Сделать главным" }).click();
    await page.waitForTimeout(1000);
    await page.reload({ waitUntil: "domcontentloaded" });
    body = await page.locator("main").innerText();
    if (body.includes("Главное") && body.includes(`Главное желание: ${wishTitle}`)) {
      pass("Set primary wish", "primary badge and hero visible");
    } else {
      fail("Set primary wish", "primary state missing");
    }

    await page.getByLabel("Действия с желанием").first().click();
    await page.getByRole("button", { name: "Отметить приобретённым" }).click();
    await page.waitForTimeout(1000);
    await page.reload({ waitUntil: "domcontentloaded" });
    body = await page.locator("main").innerText();
    if (body.includes("Приобретено")) {
      pass("Mark acquired", "status visible");
    } else {
      fail("Mark acquired", "status missing");
    }

    await page.getByLabel("Действия с желанием").first().click();
    await page.getByRole("button", { name: "Архивировать" }).click();
    await page.waitForTimeout(1000);
    await page.reload({ waitUntil: "domcontentloaded" });
    body = await page.locator("main").innerText();
    if (body.includes("Архив")) {
      pass("Archive wish", "archive section visible");
    } else {
      fail("Archive wish", "archive section missing");
    }

    if (!/В процессе|Купить|Корзина|Заказать/i.test(body)) {
      pass("No ecommerce/process copy", "forbidden terms absent");
    } else {
      fail("No ecommerce/process copy", "forbidden terms visible");
    }

    const apiResult = await page.evaluate(async () => {
      const goalsRes = await fetch("/api/goals");
      const goalsPayload = await goalsRes.json();
      const goalId = goalsPayload.goals?.[0]?.id ?? null;

      const createRes = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "API wish",
          description: "API check",
          linked_goal_id: goalId,
          target_amount: 1000,
          user_id: "00000000-0000-0000-0000-000000000000",
        }),
      });
      const created = await createRes.json();
      const wishId = created.wish?.id;

      const listRes = await fetch("/api/wishes");
      const list = await listRes.json();

      const updateRes = await fetch(`/api/wishes/${wishId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...created.wish,
          title: "API wish updated",
          status: "wanted",
        }),
      });

      const primaryRes = await fetch(`/api/wishes/${wishId}/primary`, { method: "PUT" });
      const archiveRes = await fetch(`/api/wishes/${wishId}`, { method: "DELETE" });
      const primaryGoalRes = await fetch("/api/goals/primary", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal_id: goalId }),
      });

      return {
        archiveStatus: archiveRes.status,
        createStatus: createRes.status,
        createdUserId: created.wish?.user_id ?? null,
        listStatus: listRes.status,
        listVisible: Array.isArray(list.wishes),
        primaryGoalStatus: primaryGoalRes.status,
        primaryStatus: primaryRes.status,
        updateStatus: updateRes.status,
      };
    });

    if (
      apiResult.createStatus === 201 &&
      apiResult.listStatus === 200 &&
      apiResult.updateStatus === 200 &&
      apiResult.primaryStatus === 200 &&
      apiResult.archiveStatus === 200 &&
      apiResult.primaryGoalStatus === 200 &&
      apiResult.listVisible
    ) {
      pass("Wishes API endpoints", JSON.stringify(apiResult));
    } else {
      fail("Wishes API endpoints", JSON.stringify(apiResult));
    }

    if (apiResult.createdUserId !== "00000000-0000-0000-0000-000000000000") {
      pass("API ignores client user_id", apiResult.createdUserId ?? "null");
    } else {
      fail("API ignores client user_id", "client user_id persisted");
    }

    await page.close();
  } finally {
    await browser.close();
  }

  console.log("\n--- Wishes QA summary ---");
  console.log(`Passed: ${report.checks.length}`);
  console.log(`Failed: ${report.errors.length}`);

  if (report.errors.length > 0) {
    for (const item of report.errors) {
      console.log(`  - ${item.name}: ${item.detail}`);
    }
    process.exit(1);
  }

  console.log("Wishes QA passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
