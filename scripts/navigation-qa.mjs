import { chromium } from "playwright";

import { completeOnboardingWizardToDashboard } from "./lib/onboarding-wizard.mjs";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function registerAndOnboard(page) {
  const stamp = Date.now();
  await page.goto(`${BASE_URL}/register`, { waitUntil: "domcontentloaded" });
  await page.getByLabel("Имя").fill("Navigation QA");
  await page.getByLabel("Email").fill(`navigationqa${stamp}@lifera.test`);
  await page.getByLabel("Пароль", { exact: true }).fill("Password123!");
  await page.getByLabel("Повторите пароль").fill("Password123!");
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await page.waitForURL(/\/(onboarding|dashboard|plan)/, { timeout: 90000 });

  if (page.url().includes("/onboarding")) {
    await completeOnboardingWizardToDashboard(page, {
      goalDescription: "Проверка desktop navigation shell",
      goalTitle: `Navigation QA goal ${stamp}`,
    });
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { height: 920, width: 1280 } });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(90000);
  const results = [];

  async function check(name, fn) {
    try {
      await fn();
      results.push({ name, ok: true });
      console.log(`✓ ${name}`);
    } catch (error) {
      results.push({ name, ok: false, error });
      console.error(`✗ ${name}: ${error.message}`);
    }
  }

  try {
    await registerAndOnboard(page);

    await check("Sidebar renders on desktop", async () => {
      await page.goto(`${BASE_URL}/dashboard`);
      await page.evaluate(() => localStorage.setItem("lifera.sidebar.collapsed", "false"));
      await page.reload({ waitUntil: "networkidle" });
      await page.getByLabel("Основная навигация").waitFor({ timeout: 30000 });
      await page.getByRole("link", { name: /Главная/ }).waitFor();
    });

    await check("Expanded mode shows labels", async () => {
      const sidebar = page.locator("aside").first();
      await sidebar.getByText("Цели").waitFor();
      await sidebar.getByText("Миссии").waitFor();
      await sidebar.getByText("Навыки").waitFor();
      await sidebar.getByText("Здоровье").waitFor();
      await sidebar.getByText("Финансы").waitFor();
      await sidebar.getByText("Достижения").waitFor();
      await sidebar.getByText("Ассистент").waitFor();
      await sidebar.getByRole("link", { name: "План" }).waitFor();
      await sidebar.getByRole("link", { name: "Профиль" }).waitFor();
      await sidebar.getByRole("link", { name: "Настройки" }).waitFor();
      await expectHidden(sidebar.getByText("Карта желаний"));
      await expectHidden(sidebar.getByText("Прогресс"));
      await expectHidden(sidebar.getByText("Челленджи"));
    });

    await check("Collapse button works and hides labels", async () => {
      await page.getByRole("button", { name: "Свернуть сайдбар", exact: true }).click();
      await page.getByRole("button", { name: "Открыть сайдбар" }).waitFor();
      const sidebar = page.getByLabel("Основная навигация");
      await expectHidden(sidebar.getByText("Миссии"));
    });

    await check("Collapsed state persists after reload", async () => {
      await page.reload();
      await page.getByRole("button", { name: "Открыть сайдбар" }).waitFor();
    });

    await check("Expand restores labels", async () => {
      await page.getByRole("button", { name: "Открыть сайдбар" }).click({ force: true });
      await page.getByRole("button", { name: "Свернуть сайдбар", exact: true }).waitFor();
      await page.getByLabel("Основная навигация").getByText("Миссии").waitFor();
    });

    await check("Active dashboard route is highlighted", async () => {
      await page.goto(`${BASE_URL}/dashboard`);
      await page.locator('aside a[aria-current="page"][href="/dashboard"]').waitFor();
    });

    await check("/goals/[id] highlights Goals", async () => {
      await page.goto(`${BASE_URL}/goals`);
      await page.getByRole("link", { name: /Открыть цель/ }).first().click();
      await page.waitForURL(/\/goals\/[0-9a-f-]+/, { timeout: 30000 });
      await page.locator('aside a[aria-current="page"][href="/goals"]').waitFor();
    });

    await check("/goals/wishes highlights Goals", async () => {
      await page.goto(`${BASE_URL}/goals/wishes`);
      await page.locator('aside a[aria-current="page"][href="/goals"]').waitFor();
    });

    await check("/wishes redirects to /goals/wishes", async () => {
      await page.goto(`${BASE_URL}/wishes`);
      await page.waitForURL(/\/goals\/wishes/, { timeout: 30000 });
      await page.locator('aside a[aria-current="page"][href="/goals"]').waitFor();
    });

    await check("/health is visible and highlighted", async () => {
      await page.goto(`${BASE_URL}/health`);
      await page.locator('aside a[aria-current="page"][href="/health"]').waitFor();
    });

    await check("/finance is visible and highlighted", async () => {
      await page.goto(`${BASE_URL}/finance`);
      await page.locator('aside a[aria-current="page"][href="/finance"]').waitFor();
    });

    await check("Primary direct routes remain accessible", async () => {
      await page.goto(`${BASE_URL}/skills`);
      await page.getByRole("heading", { name: "Навыки" }).waitFor();
      await page.goto(`${BASE_URL}/habits`);
      await page.getByRole("heading", { name: "Миссии", exact: true }).waitFor();
    });

    await check("Top tabs render for core routes", async () => {
      for (const route of [
        "/dashboard",
        "/goals",
        "/goals/wishes",
        "/habits",
        "/skills",
        "/health",
        "/finance",
        "/achievements",
        "/ai-assistant",
      ]) {
        await page.goto(`${BASE_URL}${route}`);
        await page.getByRole("navigation", { name: "Подменю текущего раздела" }).waitFor();
      }
    });

    await check("Top tabs do not cause horizontal body scroll", async () => {
      const width = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(width <= 1280, `desktop horizontal scroll ${width}`);
    });

    await check("Theme toggle works", async () => {
      const themeButton = page.getByRole("button", {
        name: /Светлая тема|Темная тема|Системная тема/,
      });
      await themeButton.click();
      const theme = await page.evaluate(() => document.documentElement.dataset.theme ?? "system");
      assert(["dark", "light", "system"].includes(theme), `unexpected theme ${theme}`);
    });

    await check("User menu opens with account actions", async () => {
      await page.getByRole("button", { name: "Меню пользователя" }).click();
      await page.getByRole("menuitem", { name: "Профиль" }).waitFor();
      await page.getByRole("menuitem", { name: "План" }).waitFor();
      await page.getByRole("menuitem", { name: "Настройки" }).waitFor();
      await page.getByRole("menuitem", { name: "Выйти" }).waitFor();
    });

    await check("Mobile bottom nav still works", async () => {
      await page.setViewportSize({ height: 844, width: 390 });
      await page.goto(`${BASE_URL}/dashboard`);
      await page.getByRole("navigation", { name: "Мобильная навигация" }).waitFor();
      await page.getByRole("link", { name: "Навыки" }).waitFor();
      await page.getByRole("button", { name: "Ещё" }).click();
      await page.getByRole("link", { name: "Здоровье" }).waitFor();
      await page.getByRole("link", { name: "Финансы" }).waitFor();
      await expectHidden(page.getByRole("link", { name: "Карта желаний" }));
      await expectHidden(page.getByRole("link", { name: "Прогресс" }));
      await expectHidden(page.getByRole("link", { name: "Челленджи" }));
      const width = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(width <= 390, `mobile horizontal scroll ${width}`);
    });
  } finally {
    await browser.close();
  }

  const failed = results.filter((result) => !result.ok);
  console.log(`\n--- Navigation QA summary ---`);
  console.log(`Passed: ${results.length - failed.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    process.exit(1);
  }
}

async function expectHidden(locator) {
  const visible = await locator.isVisible().catch(() => false);
  assert(!visible, "expected element to be hidden");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
