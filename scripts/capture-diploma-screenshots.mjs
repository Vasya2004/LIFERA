#!/usr/bin/env node
/**
 * Capture diploma screenshot package from production.
 * Usage: node scripts/capture-diploma-screenshots.mjs
 * Env: SCREENSHOT_BASE_URL (default https://lifera.app)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));

const baseUrl = process.env.SCREENSHOT_BASE_URL ?? "https://lifera.app";
const outDir = path.join(root, "docs/screenshots");
const testEmail = "lifera.diploma.demo@example.com";
const testPassword = "DiplomaDemoPass1!";
const displayName = "Анастасия";
const goalTitle = "Запустить личный проект за 90 дней";
const goalDescription = "Сфокусироваться на запуске side-проекта с измеримым результатом за 90 дней";
const challengeTitle = "7 дней системного старта";

const DESKTOP = { height: 900, width: 1440 };
const MOBILE = { height: 844, width: 390 };

const report = { captured: [], issues: [], missing: [], pages: [] };

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

function ensureDir() {
  fs.mkdirSync(outDir, { recursive: true });
}

async function ensureConfirmedDemoUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase env for demo user provisioning.");
  }

  const admin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: list, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  if (listError) {
    throw new Error(listError.message);
  }

  const existing = list.users.find((user) => user.email === testEmail);
  if (existing) {
    await admin.auth.admin.deleteUser(existing.id);
  }

  const { error: createError } = await admin.auth.admin.createUser({
    email: testEmail,
    email_confirm: true,
    password: testPassword,
    user_metadata: { full_name: displayName },
  });

  if (createError) {
    throw new Error(createError.message);
  }
}

async function assertCleanPage(page, label) {
  const text = await page.locator("body").innerText();
  if (text.includes("Application error")) {
    report.issues.push(`${label}: Application error visible`);
    return false;
  }
  if (/\bNaN\b/.test(text) || /\bundefined\b/.test(text)) {
    report.issues.push(`${label}: NaN/undefined in UI`);
    return false;
  }
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  if (scrollWidth > clientWidth + 1) {
    report.issues.push(`${label}: horizontal scroll ${scrollWidth}px > ${clientWidth}px`);
  }
  return true;
}

async function capture(page, filename, options = {}) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const filePath = path.join(outDir, filename);
  await page.screenshot({ path: filePath, type: "png", ...options });
  report.captured.push(filename);
  console.log(`Captured ${filename}`);
}

async function gotoReady(page, route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(500);
}

async function loginViaUi(page) {
  await gotoReady(page, "/login");
  await page.getByRole("textbox", { name: "Email" }).fill(testEmail);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
  await page.getByRole("button", { name: "Войти" }).click();
  await page.waitForURL(/\/onboarding|\/dashboard|\/plan/, { timeout: 60000 });
}

async function fillProductionOnboardingForm(page) {
  await page.getByRole("button", { name: "Личные проекты" }).click();
  await page.getByRole("textbox", { name: "Название цели" }).fill(goalTitle);
  await page.getByRole("textbox", { name: "Контекст" }).fill(goalDescription);
  await page.getByRole("button", { name: challengeTitle }).click();
  await page.getByRole("checkbox", { name: /Создать стартовую цель/ }).check();
  await page.waitForTimeout(400);
}

async function completeProductionOnboardingViaApi(page) {
  const response = await page.request.post(`${baseUrl}/api/onboarding/complete`, {
    data: {
      challenge_title: challengeTitle,
      goal_description: goalDescription,
      goal_title: goalTitle,
      selected_life_areas: ["projects"],
      starter_rituals: ["Утренний обзор плана", "30 минут глубокой работы"],
    },
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`Onboarding API failed (${response.status()}): ${body}`);
  }
}

async function captureProfileWithoutEmail(page) {
  await gotoReady(page, "/profile");
  await assertCleanPage(page, "/profile");

  await page.evaluate(() => {
    for (const label of document.querySelectorAll("dt")) {
      if (label.textContent?.trim() === "Email" && label.parentElement) {
        label.parentElement.style.display = "none";
      }
    }
  });

  await capture(page, "17_profile.png");
  report.pages.push({ file: "17_profile.png", route: "/profile", viewport: "desktop" });
}

async function main() {
  ensureDir();
  await ensureConfirmedDemoUser();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    colorScheme: "dark",
    locale: "ru-RU",
    viewport: DESKTOP,
  });
  const page = await context.newPage();

  try {
    await gotoReady(page, "/");
    await assertCleanPage(page, "landing");
    await capture(page, "01_landing_hero.png");
    report.pages.push({ file: "01_landing_hero.png", route: "/", viewport: "desktop" });

    await gotoReady(page, "/pricing");
    await assertCleanPage(page, "pricing");
    await capture(page, "02_pricing.png");
    report.pages.push({ file: "02_pricing.png", route: "/pricing", viewport: "desktop" });

    await gotoReady(page, "/register");
    await assertCleanPage(page, "register");
    await capture(page, "03_register.png");
    report.pages.push({ file: "03_register.png", route: "/register", viewport: "desktop" });

    await loginViaUi(page);

    if (!page.url().includes("/onboarding")) {
      await gotoReady(page, "/onboarding");
    }

    await fillProductionOnboardingForm(page);
    await assertCleanPage(page, "onboarding");
    await capture(page, "04_onboarding.png");
    report.pages.push({ file: "04_onboarding.png", route: "/onboarding", viewport: "desktop" });

    await completeProductionOnboardingViaApi(page);

    const appRoutes = [
      ["05_dashboard.png", "/dashboard"],
      ["06_goals.png", "/goals"],
      ["07_challenges.png", "/challenges"],
      ["09_rituals.png", "/habits"],
      ["10_progress.png", "/progress"],
      ["11_achievements.png", "/achievements"],
      ["12_assistant.png", "/ai-assistant"],
      ["13_skills.png", "/skills"],
      ["14_health.png", "/health"],
      ["15_finance.png", "/finance"],
      ["16_plan.png", "/plan"],
      ["18_settings.png", "/settings"],
    ];

    for (const [filename, route] of appRoutes) {
      await gotoReady(page, route);
      await assertCleanPage(page, route);
      await capture(page, filename);
      report.pages.push({ file: filename, route, viewport: "desktop" });

      if (filename === "07_challenges.png") {
        const missionHref = await page
          .locator('a[href^="/challenges/"]:not([href="/challenges"])')
          .first()
          .getAttribute("href")
          .catch(() => null);

        if (missionHref) {
          await gotoReady(page, missionHref);
          await assertCleanPage(page, "challenge detail");
          await capture(page, "08_challenge_detail.png");
          report.pages.push({
            file: "08_challenge_detail.png",
            route: missionHref,
            viewport: "desktop",
          });
        } else {
          report.missing.push("08_challenge_detail.png");
          report.issues.push("challenge detail: no mission link on /challenges");
        }
      }
    }

    await captureProfileWithoutEmail(page);

    await page.setViewportSize(MOBILE);
    await gotoReady(page, "/dashboard");
    await assertCleanPage(page, "mobile dashboard");
    await capture(page, "19_mobile_dashboard_390.png");
    report.pages.push({ file: "19_mobile_dashboard_390.png", route: "/dashboard", viewport: "390px" });

    await gotoReady(page, "/habits");
    await assertCleanPage(page, "mobile rituals");
    await capture(page, "20_mobile_rituals_390.png");
    report.pages.push({ file: "20_mobile_rituals_390.png", route: "/habits", viewport: "390px" });
  } finally {
    await browser.close();
  }

  const expected = [
    "01_landing_hero.png",
    "02_pricing.png",
    "03_register.png",
    "04_onboarding.png",
    "05_dashboard.png",
    "06_goals.png",
    "07_challenges.png",
    "08_challenge_detail.png",
    "09_rituals.png",
    "10_progress.png",
    "11_achievements.png",
    "12_assistant.png",
    "13_skills.png",
    "14_health.png",
    "15_finance.png",
    "16_plan.png",
    "17_profile.png",
    "18_settings.png",
    "19_mobile_dashboard_390.png",
    "20_mobile_rituals_390.png",
  ];

  for (const file of expected) {
    if (!fs.existsSync(path.join(outDir, file))) {
      if (!report.missing.includes(file)) {
        report.missing.push(file);
      }
    }
  }

  console.log("\n--- Screenshot capture summary ---");
  console.log(`Captured: ${report.captured.length}`);
  console.log(`Missing: ${report.missing.length}`);
  console.log(`Issues: ${report.issues.length}`);

  if (report.missing.length > 0) {
    for (const item of report.missing) console.log(`  missing: ${item}`);
    process.exit(1);
  }

  if (report.issues.length > 0) {
    for (const item of report.issues) console.log(`  issue: ${item}`);
  }

  console.log("Screenshot package ready.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
