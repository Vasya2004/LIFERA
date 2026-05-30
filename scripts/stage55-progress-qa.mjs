#!/usr/bin/env node
/**
 * Stage 5.5 Progress / Analytics manual QA — Playwright + Supabase verification.
 * Usage: node scripts/stage55-progress-qa.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

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

const baseUrl = process.env.STAGE55_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const testEmail = `stage55qa${timestamp}@lifera.test`;
const emptyEmail = `stage55empty${timestamp}@lifera.test`;
const testPassword = "Stage55QaPass1!";
const testName = "Stage55 QA User";
const goalTitle = `Stage 5.5 QA цель ${timestamp}`;
const habitTitle = `Stage 5.5 QA ритуал ${timestamp}`;

const report = {
  checks: [],
  email: testEmail,
  emptyEmail,
  errors: [],
  fixes: [],
  mobile: {},
  progressData: null,
};

function pass(name, detail) {
  report.checks.push({ name, ok: true, detail });
  console.log(`✓ ${name}: ${detail}`);
}

function fail(name, detail) {
  report.errors.push({ name, detail });
  console.log(`✗ ${name}: ${detail}`);
}

function weekStartIsoDate() {
  const date = new Date();
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date.toISOString().slice(0, 10);
}

async function registerAndOnboard(page, email, name, goal) {
  await page.goto(`${baseUrl}/register`, { waitUntil: "domcontentloaded" });
  await page.getByRole("textbox", { name: "Имя" }).fill(name);
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
  await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await page.waitForURL(/\/onboarding/, { timeout: 30000 });
  await page.getByRole("textbox", { name: "Название цели" }).fill(goal);
  await page
    .getByRole("checkbox", {
      name: "Создать стартовую цель, челлендж с этапами и открыть Dashboard с моими данными.",
    })
    .check();
  const onboardingComplete = page.waitForResponse(
    (response) =>
      response.url().includes("/api/onboarding/complete") && response.status() === 200,
    { timeout: 90000 },
  );
  await page.getByRole("button", { name: "Запустить Life RPG-систему" }).click();
  await onboardingComplete;
  await page.waitForURL(/\/dashboard/, { timeout: 90000 });
}

async function visibleBodyText(page) {
  return page.evaluate(() => {
    const clone = document.body.cloneNode(true);
    clone.querySelectorAll("script, style, noscript").forEach((node) => node.remove());
    return clone.textContent ?? "";
  });
}

async function checkMobile(page, label, width) {
  await page.setViewportSize({ height: 844, width });
  await page.goto(`${baseUrl}/progress`, { waitUntil: "networkidle" });

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  const hasHorizontalScroll = scrollWidth > clientWidth + 1;
  const content = await visibleBodyText(page);
  const hasBadValues =
    /\bNaN\b/.test(content) ||
    /\bundefined\b/.test(content) ||
    /\bInfinity\b/.test(content);

  const screenshotPath = path.join(root, `output/stage55-progress-mobile-${width}.png`);
  fs.mkdirSync(path.join(root, "output"), { recursive: true });
  await page.screenshot({ fullPage: true, path: screenshotPath });

  report.mobile[`${width}px`] = {
    hasBadValues,
    hasHorizontalScroll,
    screenshot: screenshotPath,
  };

  if (hasHorizontalScroll) fail(`Mobile ${label}`, `horizontal scroll at ${width}px`);
  else pass(`Mobile ${label}`, `${width}px — no horizontal scroll`);

  if (hasBadValues) fail(`Mobile ${label} values`, "NaN/undefined/Infinity in DOM");
  else pass(`Mobile ${label} values`, "no invalid numbers in DOM");
}

async function main() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("Missing Supabase env.");
    process.exit(1);
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await registerAndOnboard(page, testEmail, testName, goalTitle);
    pass("Register + onboarding", page.url());

    const { data: usersData } = await admin.auth.admin.listUsers({ page: 1, perPage: 50 });
    const testUser = usersData?.users?.find((u) => u.email === testEmail);
    if (!testUser) {
      fail("Resolve test user", "not found");
      throw new Error("missing user");
    }
    const userId = testUser.id;

    const { data: challenge } = await admin
      .from("challenges")
      .select("id,title")
      .eq("user_id", userId)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    const { data: activeStage } = challenge
      ? await admin
          .from("challenge_stages")
          .select("id,title")
          .eq("user_id", userId)
          .eq("challenge_id", challenge.id)
          .eq("status", "active")
          .maybeSingle()
      : { data: null };

    if (challenge && activeStage) {
      await page.goto(`${baseUrl}/challenges/${challenge.id}`, { waitUntil: "networkidle" });
      const completeButton = page.getByRole("button", { name: "Завершить шаг" });
      if ((await completeButton.count()) > 0) {
        await completeButton.click();
        await page.waitForTimeout(2000);
        pass("Challenge step completed", activeStage.title);
      }
    }

    await page.goto(`${baseUrl}/habits`, { waitUntil: "networkidle" });
    await page.getByRole("textbox", { name: "Название ритуала" }).fill(habitTitle);
    await page.getByRole("button", { name: "Создать ритуал" }).click();
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "Отметить выполненной" }).first().click();
    await page.waitForTimeout(2000);
    pass("Habit created and completed", habitTitle);

    const weekStart = weekStartIsoDate();

    await page.goto(`${baseUrl}/progress`, { waitUntil: "networkidle" });

    const [{ data: profile }, { data: xpRows }] = await Promise.all([
      admin.from("user_profiles").select("*").eq("user_id", userId).single(),
      admin.from("xp_transactions").select("*").eq("user_id", userId),
    ]);

    const weekXp = (xpRows ?? [])
      .filter((row) => row.created_at.slice(0, 10) >= weekStart)
      .reduce((sum, row) => sum + Number(row.amount ?? 0), 0);

    const [{ count: weekHabits }, { count: weekStages }] = await Promise.all([
      admin
        .from("habit_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("completed_on", weekStart),
      admin
        .from("challenge_stages")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "completed")
        .gte("completed_at", `${weekStart}T00:00:00`),
    ]);

    const xpFromLedger = (xpRows ?? []).reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
    const expectedXpTotal = Math.max(Number(profile?.xp_total ?? 0), xpFromLedger);

    report.progressData = {
      expectedXpTotal,
      level: profile?.level,
      life_score: profile?.life_score,
      profileXpTotal: profile?.xp_total,
      weekHabits,
      weekStages,
      weekXp,
      xpFromLedger,
    };

    if (Number(profile?.xp_total ?? 0) < xpFromLedger) {
      report.fixes.push(
        "Progress page uses XP ledger sum when profile.xp_total is behind transactions.",
      );
    }

    if (page.url().includes("/progress")) pass("/progress opens", page.url());
    else fail("/progress opens", page.url());

    const content = await visibleBodyText(page);
    if (content.includes("Application error") || content.includes("Unhandled Runtime Error")) {
      fail("Runtime errors", "error boundary visible");
    } else {
      pass("No runtime error", "page rendered");
    }

    if (/\bNaN\b/.test(content) || /\bundefined\b/.test(content)) {
      fail("Invalid values in DOM", "NaN or undefined found in visible text");
    } else {
      pass("Valid numeric display", "no NaN/undefined in visible text");
    }

    const xpTotal = String(expectedXpTotal);
    const level = String(profile?.level ?? 1);
    const lifeScore = String(profile?.life_score ?? 0);

    if (content.includes(xpTotal)) pass("Top stats XP total", xpTotal);
    else fail("Top stats XP total", `expected ${xpTotal}`);

    if (content.includes(level)) pass("Top stats Level", level);
    else fail("Top stats Level", `expected ${level}`);

    if (content.includes(lifeScore)) pass("Top stats Life Score", lifeScore);
    else fail("Top stats Life Score", `expected ${lifeScore}`);

    if (content.includes(String(weekXp))) pass("Top stats weekly XP", String(weekXp));
    else fail("Top stats weekly XP", `expected ${weekXp}`);

    if (content.includes(String(weekHabits ?? 0))) {
      pass("Top stats habit completions", String(weekHabits ?? 0));
    } else {
      fail("Top stats habit completions", String(weekHabits ?? 0));
    }

    if (content.includes(String(weekStages ?? 0))) {
      pass("Top stats challenge steps", String(weekStages ?? 0));
    } else {
      fail("Top stats challenge steps", String(weekStages ?? 0));
    }

    if (content.includes("Прогресс уровня")) pass("Level progress card", "visible");
    else fail("Level progress card", "missing");

    if (content.includes("Источники XP")) pass("XP sources", "visible");
    else fail("XP sources", "missing");

    if (content.includes("Сферы жизни")) pass("Life areas section", "visible");
    else fail("Life areas section", "missing");

    if (content.includes("Личные проекты") || content.includes("Карьера")) {
      pass("Life area labels", "ru labels visible");
    } else {
      fail("Life area labels", "missing");
    }

    const dayBars = await page.locator("text=XP").count();
    if (dayBars >= 7) pass("Weekly activity 7 days", `${dayBars} XP labels`);
    else fail("Weekly activity 7 days", `count=${dayBars}`);

    if (content.includes(goalTitle)) pass("Goals section data", goalTitle);
    else fail("Goals section data", "goal title missing");

    if (challenge && content.includes(challenge.title)) {
      pass("Challenges section data", challenge.title);
    } else if (challenge) {
      fail("Challenges section data", challenge.title);
    }

    if (content.includes(habitTitle)) pass("Habits section data", habitTitle);
    else fail("Habits section data", habitTitle);

    if (content.includes("Достижения")) pass("Achievements section", "visible");
    else fail("Achievements section", "missing");

    if (content.includes("AI-вывод по прогрессу")) pass("AI insight section", "visible");
    else fail("AI insight section", "missing");

    await checkMobile(page, "390", 390);
    await checkMobile(page, "430", 430);

    await page.setViewportSize({ height: 900, width: 1280 });
    await context.clearCookies();
    await registerAndOnboard(page, emptyEmail, "Stage55 Empty", `Empty goal ${timestamp}`);
    await page.goto(`${baseUrl}/progress`, { waitUntil: "networkidle" });
    const emptyContent = await visibleBodyText(page);

    if (emptyContent.includes("Нет активных ритуалов")) {
      pass("Habits empty state", "section CTA visible");
    } else {
      fail("Habits empty state", "expected habits section empty");
    }

    const habitsLink = page.getByRole("link", { name: "Создать привычку" });
    if ((await habitsLink.count()) > 0) {
      const href = await habitsLink.first().getAttribute("href");
      if (href === "/habits") pass("Empty CTA /habits", href);
      else fail("Empty CTA /habits", href ?? "missing");
    } else {
      fail("Empty CTA /habits", "link not found");
    }

    fs.writeFileSync(
      path.join(root, "output/stage55-qa-report.json"),
      JSON.stringify({ ...report, finishedAt: new Date().toISOString() }, null, 2),
    );

    console.log(`\nTest user: ${testEmail}`);
    console.log(`Empty user: ${emptyEmail}`);
    console.log(`Report: output/stage55-qa-report.json`);

    if (report.errors.length > 0) process.exit(1);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
