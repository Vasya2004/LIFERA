#!/usr/bin/env node
/**
 * Stage 4.5 habits E2E QA — Playwright + Supabase verification.
 * Usage: node scripts/stage45-habits-qa.mjs
 * Requires: dev server at STAGE45_BASE_URL (default http://localhost:3000)
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

const baseUrl = process.env.STAGE45_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const testEmail = `stage45qa${timestamp}@lifera.test`;
const testPassword = "Stage45QaPass1!";
const testName = "Stage45 QA User";
const goalTitle = `Stage 4.5 QA цель ${timestamp}`;
const habitTitle = `Stage 4.5 QA ритуал ${timestamp}`;

const report = {
  checks: [],
  email: testEmail,
  errors: [],
  habitId: null,
  profileXpAfter: null,
  profileXpBefore: 0,
};

function pass(name, detail) {
  report.checks.push({ name, ok: true, detail });
  console.log(`✓ ${name}: ${detail}`);
}

function fail(name, detail) {
  report.errors.push({ name, detail });
  console.log(`✗ ${name}: ${detail}`);
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

  const { error: habitsProbeError } = await admin.from("habits").select("id").limit(1);
  if (habitsProbeError) {
    console.error(`Habits table unavailable: ${habitsProbeError.message}`);
    console.error("Apply supabase/migrations/0002_habits_foundation.sql in Supabase SQL Editor, then:");
    console.error("  NOTIFY pgrst, 'reload schema';");
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(`${baseUrl}/register`, { waitUntil: "networkidle" });
    await page.getByRole("textbox", { name: "Имя" }).fill(testName);
    await page.getByRole("textbox", { name: "Email" }).fill(testEmail);
    await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
    await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
    await page.getByRole("button", { name: "Создать аккаунт" }).click();
    await page.waitForURL(/\/onboarding/, { timeout: 15000 });
    pass("Register → Onboarding", page.url());

    await page.getByRole("textbox", { name: "Название цели" }).fill(goalTitle);
    await page
      .getByRole("checkbox", {
        name: "Создать стартовую цель, челлендж с этапами и открыть Dashboard с моими данными.",
      })
      .check();
    await page.getByRole("button", { name: "Запустить Life RPG-систему" }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    pass("Onboarding → Dashboard", page.url());

    const { data: usersData } = await admin.auth.admin.listUsers({ page: 1, perPage: 50 });
    const testUser = usersData?.users?.find((u) => u.email === testEmail);
    if (!testUser) {
      fail("Resolve test user", "not found");
      throw new Error("missing user");
    }
    const userId = testUser.id;
    pass("Test user in Supabase Auth", userId);

    const { data: profileBefore } = await admin
      .from("user_profiles")
      .select("xp_total")
      .eq("user_id", userId)
      .single();
    report.profileXpBefore = Number(profileBefore?.xp_total ?? 0);

    await page.goto(`${baseUrl}/habits`, { waitUntil: "networkidle" });
    if (page.url().includes("/habits")) pass("/habits opens", page.url());
    else fail("/habits opens", page.url());

    await page.getByRole("textbox", { name: "Название ритуала" }).fill(habitTitle);
    const [createResponse] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes("/api/habits") && res.request().method() === "POST",
        { timeout: 15000 },
      ),
      page.getByRole("button", { name: "Создать ритуал" }).click(),
    ]);
    const createBody = await createResponse.json().catch(() => ({}));
    if (createResponse.ok()) {
      pass("Habit create API", `status ${createResponse.status()}`);
      if (createBody?.habit?.id) report.habitId = createBody.habit.id;
    } else {
      fail("Habit create API", `status ${createResponse.status()}: ${createBody?.error ?? "unknown"}`);
    }

    await page.waitForTimeout(1000);

    const { data: habitsAfterCreate } = await admin
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .eq("title", habitTitle)
      .maybeSingle();

    if (habitsAfterCreate) {
      report.habitId = habitsAfterCreate.id;
      pass("Habit created", habitTitle);
    } else {
      fail("Habit created", "not found in DB");
      throw new Error("habit missing");
    }

    if ((await page.getByText(habitTitle).count()) > 0) pass("Habit visible in list", habitTitle);
    else fail("Habit visible in list", "missing on page");

    const completeButton = page
      .getByRole("button", { name: "Отметить выполненной" })
      .first();
    const [completeResponse] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/habits/") &&
          res.url().includes("/complete") &&
          res.request().method() === "POST",
        { timeout: 15000 },
      ),
      completeButton.click(),
    ]);
    const completeBody = await completeResponse.json().catch(() => ({}));
    if (completeResponse.ok() && !completeBody?.alreadyCompleted) {
      pass("Habit complete API", `status ${completeResponse.status()}`);
    } else {
      fail("Habit complete API", JSON.stringify(completeBody));
    }

    await page.waitForTimeout(1000);

    const today = new Date().toISOString().slice(0, 10);
    const { data: habitLog } = await admin
      .from("habit_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("habit_id", habitsAfterCreate.id)
      .eq("completed_on", today)
      .maybeSingle();

    if (habitLog) pass("habit_log created", `xp_awarded=${habitLog.xp_awarded}`);
    else fail("habit_log created", "missing");

    const { data: habitAfterComplete } = await admin
      .from("habits")
      .select("*")
      .eq("id", habitsAfterCreate.id)
      .single();

    if (Number(habitAfterComplete?.streak_current ?? 0) >= 1) {
      pass("streak_current updated", String(habitAfterComplete?.streak_current));
    } else fail("streak_current updated", String(habitAfterComplete?.streak_current));

    if (Number(habitAfterComplete?.streak_best ?? 0) >= 1) {
      pass("streak_best updated", String(habitAfterComplete?.streak_best));
    } else fail("streak_best updated", String(habitAfterComplete?.streak_best));

    if (habitAfterComplete?.last_completed_at) pass("last_completed_at updated", "set");
    else fail("last_completed_at updated", "null");

    const { data: xpRows } = await admin
      .from("xp_transactions")
      .select("*")
      .eq("user_id", userId)
      .eq("source_type", "habit_log")
      .eq("source_id", habitLog?.id ?? "");

    if ((xpRows ?? []).length === 1) pass("XP transaction", `+${xpRows[0].amount}`);
    else fail("XP transaction", `count=${xpRows?.length ?? 0}`);

    const { data: profileAfter } = await admin
      .from("user_profiles")
      .select("xp_total")
      .eq("user_id", userId)
      .single();
    report.profileXpAfter = Number(profileAfter?.xp_total ?? 0);
    if (report.profileXpAfter > report.profileXpBefore) {
      pass("XP total updated", `${report.profileXpBefore} → ${report.profileXpAfter}`);
    } else fail("XP total updated", `${report.profileXpBefore} → ${report.profileXpAfter}`);

    const dupResponse = await page.request.post(
      `${baseUrl}/api/habits/${habitsAfterCreate.id}/complete`,
    );
    const dupBody = await dupResponse.json();
    if (dupBody?.alreadyCompleted) pass("Duplicate complete same day", "alreadyCompleted");
    else fail("Duplicate complete same day", JSON.stringify(dupBody));

    const { data: profileDup } = await admin
      .from("user_profiles")
      .select("xp_total")
      .eq("user_id", userId)
      .single();
    if (Number(profileDup?.xp_total ?? 0) === report.profileXpAfter) {
      pass("No duplicate XP same day", String(report.profileXpAfter));
    } else {
      fail("No duplicate XP same day", `${report.profileXpAfter} → ${profileDup?.xp_total}`);
    }

    const { data: habitAchievement } = await admin
      .from("achievements")
      .select("*")
      .eq("user_id", userId)
      .eq("condition_type", "habit_completions")
      .eq("condition_value", 1)
      .maybeSingle();

    if (habitAchievement?.status === "unlocked") {
      pass("Habit achievement unlocked", "Первый ритуал");
    } else {
      fail("Habit achievement unlocked", habitAchievement?.status ?? "missing row");
    }

    await page.goto(`${baseUrl}/dashboard`, { waitUntil: "networkidle" });
    if ((await page.getByText("Ритуалы прокачки").count()) > 0) {
      pass("Dashboard habits block", "Ритуалы прокачки");
    } else fail("Dashboard habits block", "missing");

    if ((await page.getByText(habitTitle).count()) > 0) {
      pass("Dashboard shows habit", habitTitle);
    } else fail("Dashboard shows habit", "title not found");

    await page.goto(`${baseUrl}/progress`, { waitUntil: "networkidle" });
    const progressContent = await page.content();
    if (progressContent.includes("Ритуалы прокачки") || progressContent.includes("Выполнено ритуалов")) {
      pass("Progress habits section", "visible");
    } else fail("Progress habits section", "missing");

    for (let i = 2; i <= 5; i += 1) {
      const createResponse = await page.request.post(`${baseUrl}/api/habits`, {
        data: {
          life_area: "health",
          title: `Limit habit ${i} ${timestamp}`,
          xp_reward: 10,
        },
      });
      if (!createResponse.ok()) {
        fail(`Create habit ${i} for limit test`, String(createResponse.status()));
      }
    }

    const sixthResponse = await page.request.post(`${baseUrl}/api/habits`, {
      data: {
        life_area: "health",
        title: `Limit habit 6 ${timestamp}`,
        xp_reward: 10,
      },
    });
    const sixthBody = await sixthResponse.json();
    if (sixthResponse.status() === 403 && sixthBody?.code === "PLAN_LIMIT") {
      pass("Habit Free limit API", "PLAN_LIMIT");
    } else {
      fail("Habit Free limit API", `status=${sixthResponse.status()} body=${JSON.stringify(sixthBody)}`);
    }

    await page.goto(`${baseUrl}/habits`, { waitUntil: "networkidle" });
    await page.getByRole("textbox", { name: "Название ритуала" }).fill(`Limit habit 6 UI ${timestamp}`);
    await page.getByRole("button", { name: "Создать ритуал" }).click();
    await page.waitForTimeout(1200);
    const limitUiVisible =
      (await page.getByText("Free-плане", { exact: false }).count()) > 0 &&
      (await page.getByRole("link", { name: /Открыть план/i }).count()) > 0;
    if (limitUiVisible) pass("Habit Free limit UI", "PlanLimitAlert + /plan");
    else fail("Habit Free limit UI", "alert not found");

    await page.goto(`${baseUrl}/plan`, { waitUntil: "networkidle" });
    const planContent = await page.content();
    if (planContent.includes("5") && planContent.includes("привыч")) {
      pass("/plan shows habits limit", "5 active habits");
    } else fail("/plan shows habits limit", "text not found");

    fs.mkdirSync(path.join(root, "output"), { recursive: true });
    fs.writeFileSync(
      path.join(root, "output/stage45-qa-report.json"),
      JSON.stringify({ ...report, finishedAt: new Date().toISOString() }, null, 2),
    );

    console.log(`\nTest user: ${testEmail}`);
    console.log(`Report: output/stage45-qa-report.json`);

    if (report.errors.length > 0) process.exit(1);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
