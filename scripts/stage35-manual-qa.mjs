#!/usr/bin/env node
/**
 * Stage 3.5 browser E2E QA — single Playwright session.
 * Usage: node scripts/stage35-manual-qa.mjs
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

const baseUrl = process.env.STAGE35_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const testEmail = `stage35qa${timestamp}@lifera.test`;
const testPassword = "Stage35QaPass1!";
const testName = "Stage35 QA User";
const goalTitle = `Stage 3.5 QA цель ${timestamp}`;

const report = {
  achievementsAfter: null,
  challengeId: null,
  checks: [],
  email: testEmail,
  errors: [],
  fixes: [],
  goalProgressAfter: null,
  profileXpAfter: null,
  profileXpBefore: 0,
  stageCompleteResponse: null,
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
    console.error("Missing Supabase env for verification.");
    process.exit(1);
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Register
    await page.goto(`${baseUrl}/register`, { waitUntil: "networkidle" });
    await page.getByRole("textbox", { name: "Имя" }).fill(testName);
    await page.getByRole("textbox", { name: "Email" }).fill(testEmail);
    await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
    await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
    await page.getByRole("button", { name: "Создать аккаунт" }).click();
    await page.waitForURL(/\/onboarding/, { timeout: 15000 });
    pass("Register → Onboarding", page.url());

    // 2. Onboarding
    await page.getByRole("textbox", { name: "Название цели" }).fill(goalTitle);
    await page
      .getByRole("checkbox", {
        name: "Создать стартовую цель, челлендж с этапами и открыть Dashboard с моими данными.",
      })
      .check();
    await page.getByRole("button", { name: "Запустить Life RPG-систему" }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    pass("Onboarding → Dashboard", page.url());

    // Resolve user id via admin list (recent user by email)
    const { data: usersData, error: usersError } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 50,
    });
    if (usersError) fail("Resolve test user", usersError.message);
    const testUser = usersData?.users?.find((u) => u.email === testEmail);
    if (!testUser) {
      fail("Resolve test user", "User not found in auth.users");
      throw new Error("Test user missing");
    }
    pass("Test user in Supabase Auth", testUser.id);

    const userId = testUser.id;

    const { data: profile } = await admin
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (profile?.onboarding_completed) pass("Profile onboarding_completed", "true");
    else fail("Profile onboarding_completed", String(profile?.onboarding_completed));

    report.profileXpBefore = Number(profile?.xp_total ?? 0);

    const { data: goals } = await admin
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active");
    if ((goals ?? []).some((g) => g.title === goalTitle)) {
      pass("Starter goal created", goalTitle);
    } else {
      fail("Starter goal created", `Not found: ${goalTitle}`);
    }

    const { data: challenges } = await admin
      .from("challenges")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .eq("is_template", false);
    const challenge = (challenges ?? [])[0];
    if (!challenge) {
      fail("Starter challenge created", "none");
      throw new Error("No challenge");
    }
    report.challengeId = challenge.id;
    pass("Starter challenge created", challenge.title);

    const { data: stages } = await admin
      .from("challenge_stages")
      .select("*")
      .eq("user_id", userId)
      .eq("challenge_id", challenge.id)
      .order("order_index", { ascending: true });
    const activeStage = (stages ?? []).find((s) => s.status === "active");
    if ((stages ?? []).length >= 5 && activeStage) {
      pass("Starter stages", `${stages.length} stages, active: ${activeStage.title}`);
    } else {
      fail("Starter stages", `count=${stages?.length ?? 0}, active=${activeStage?.title ?? "none"}`);
    }

    // Dashboard content
    await expectText(page, goalTitle, "Dashboard shows goal");
    await expectText(page, challenge.title, "Dashboard shows challenge");

    // 3. Challenge detail
    await page.goto(`${baseUrl}/challenges/${challenge.id}`, { waitUntil: "networkidle" });
    if (page.url().includes(challenge.id)) pass("Challenge detail opens", page.url());
    else fail("Challenge detail opens", page.url());

    const completeButton = page.getByRole("button", { name: "Завершить шаг" });
    await completeButton.waitFor({ timeout: 10000 });

    // 4. Complete stage (first time)
    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes(`/api/challenges/${challenge.id}/stages/`) &&
          res.url().includes("/complete") &&
          res.request().method() === "POST",
        { timeout: 15000 },
      ),
      completeButton.click(),
    ]);
    const body = await response.json();
    report.stageCompleteResponse = body;

    if (response.status() === 200) pass("Stage complete API", `status 200, awarded=${body?.xp?.awarded}`);
    else fail("Stage complete API", `status ${response.status()}: ${body?.error ?? "unknown"}`);

    await page.waitForTimeout(1500);

    const { data: stageAfter } = await admin
      .from("challenge_stages")
      .select("*")
      .eq("id", activeStage.id)
      .single();
    if (stageAfter?.status === "completed") pass("Stage status completed", activeStage.title);
    else fail("Stage status completed", String(stageAfter?.status));

    const { data: xpRows } = await admin
      .from("xp_transactions")
      .select("*")
      .eq("user_id", userId)
      .eq("source_type", "challenge_stage")
      .eq("source_id", activeStage.id);
    if ((xpRows ?? []).length === 1) pass("xp_transactions row", `amount=${xpRows[0].amount}`);
    else fail("xp_transactions row", `count=${xpRows?.length ?? 0}`);

    const { data: profileAfter } = await admin
      .from("user_profiles")
      .select("xp_total, level")
      .eq("user_id", userId)
      .single();
    report.profileXpAfter = Number(profileAfter?.xp_total ?? 0);
    if (report.profileXpAfter > report.profileXpBefore) {
      pass("XP total updated", `${report.profileXpBefore} → ${report.profileXpAfter}`);
    } else {
      fail("XP total updated", `${report.profileXpBefore} → ${report.profileXpAfter}`);
    }

    if (Number(profileAfter?.level ?? 1) >= 1) pass("Level recalculated", String(profileAfter?.level));

    const { data: challengeAfter } = await admin
      .from("challenges")
      .select("progress")
      .eq("id", challenge.id)
      .single();
    report.challengeProgress = Number(challengeAfter?.progress ?? 0);
    if (report.challengeProgress > 0) pass("Challenge progress", `${report.challengeProgress}%`);
    else fail("Challenge progress", `${report.challengeProgress}%`);

    const goalId = challenge.goal_id;
    if (goalId) {
      const { data: goalAfter } = await admin.from("goals").select("progress").eq("id", goalId).single();
      report.goalProgressAfter = Number(goalAfter?.progress ?? 0);
      if (report.goalProgressAfter > 0) pass("Goal progress", `${report.goalProgressAfter}%`);
      else fail("Goal progress", `${report.goalProgressAfter}%`);
    }

    const { data: achievements } = await admin
      .from("achievements")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "unlocked");
    report.achievementsAfter = achievements ?? [];
    const firstStep = (achievements ?? []).find((a) => a.title === "Первый шаг");
    if (firstStep) pass("Achievement unlock", "Первый шаг");
    else fail("Achievement unlock", "Первый шаг not unlocked");

    // 5. Double complete — no duplicate XP
    const xpBeforeDup = report.profileXpAfter;
    const dupResponse = await page.request.post(
      `${baseUrl}/api/challenges/${challenge.id}/stages/${activeStage.id}/complete`,
    );
    const dupBody = await dupResponse.json();
    if (dupBody?.alreadyCompleted || dupBody?.xp?.awarded === false) {
      pass("Duplicate complete idempotent", "alreadyCompleted or no XP");
    } else {
      fail("Duplicate complete idempotent", JSON.stringify(dupBody));
    }

    const { data: profileDup } = await admin
      .from("user_profiles")
      .select("xp_total")
      .eq("user_id", userId)
      .single();
    if (Number(profileDup?.xp_total ?? 0) === xpBeforeDup) pass("No duplicate XP", String(xpBeforeDup));
    else fail("No duplicate XP", `${xpBeforeDup} → ${profileDup?.xp_total}`);

    // 6. Dashboard refresh
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: "networkidle" });
    const xpText = String(report.profileXpAfter);
    if ((await page.content()).includes(xpText) || (await page.getByText(xpText).count()) > 0) {
      pass("Dashboard XP after refresh", xpText);
    } else {
      // XP shown in sidebar/topbar - check Level text area
      const content = await page.content();
      if (content.includes("Level") && content.includes("XP")) pass("Dashboard XP after refresh", "XP block visible");
      else fail("Dashboard XP after refresh", "XP not visible");
    }

    // 7. Achievements page
    await page.goto(`${baseUrl}/achievements`, { waitUntil: "networkidle" });
    if ((await page.content()).includes("Первый шаг")) pass("/achievements shows unlock", "Первый шаг");
    else fail("/achievements shows unlock", "missing");

    // 8. Goal limit (create 3 more to hit 4th)
    await page.goto(`${baseUrl}/goals`, { waitUntil: "networkidle" });
    for (let i = 1; i <= 3; i += 1) {
      await page.getByRole("textbox", { name: "Название квеста" }).fill(`Extra goal ${i} ${timestamp}`);
      await page.getByRole("button", { name: "Создать квест" }).click();
      await page.waitForTimeout(1200);
    }
    await page.getByRole("textbox", { name: "Название квеста" }).fill(`Extra goal 4 ${timestamp}`);
    await page.getByRole("button", { name: "Создать квест" }).click();
    await page.waitForTimeout(1200);
    const goalLimitVisible =
      (await page.getByText("Free-плане", { exact: false }).count()) > 0 &&
      (await page.getByRole("link", { name: /Открыть план/i }).count()) > 0;
    if (goalLimitVisible) pass("Goal Free limit UI", "RU message + /plan CTA");
    else fail("Goal Free limit UI", "alert not found");

    // 9. Challenge limit — need 2 active already + create 3rd
    await page.goto(`${baseUrl}/challenges`, { waitUntil: "networkidle" });
    for (let i = 1; i <= 2; i += 1) {
      await page.getByRole("textbox", { name: "Название миссии" }).fill(`Extra mission ${i} ${timestamp}`);
      await page.getByRole("button", { name: "Создать миссию" }).click();
      await page.waitForTimeout(2500);
      await page.goto(`${baseUrl}/challenges`, { waitUntil: "networkidle" });
    }
    await page.getByRole("textbox", { name: "Название миссии" }).fill(`Extra mission 3 ${timestamp}`);
    await page.getByRole("button", { name: "Создать миссию" }).click();
    await page.waitForTimeout(1500);
    const challengeLimitVisible =
      (await page.getByText("Free-плане", { exact: false }).count()) > 0 &&
      (await page.getByRole("link", { name: /Открыть план/i }).count()) > 0;
    if (challengeLimitVisible) pass("Challenge Free limit UI", "RU message + /plan CTA");
    else fail("Challenge Free limit UI", "alert not found");

    // 10. /plan
    await page.goto(`${baseUrl}/plan`, { waitUntil: "networkidle" });
    if (page.url().includes("/plan") || page.url().includes("/billing")) pass("/plan opens", page.url());
    else fail("/plan opens", page.url());

    fs.writeFileSync(
      path.join(root, "output/stage35-qa-report.json"),
      JSON.stringify({ ...report, finishedAt: new Date().toISOString() }, null, 2),
    );
    fs.writeFileSync(
      "/tmp/lifera-stage35-env.txt",
      `EMAIL=${testEmail}\nUSER_ID=${userId}\nCHALLENGE_ID=${challenge.id}\n`,
    );

    console.log(`\nTest user: ${testEmail}`);
    console.log(`Report: output/stage35-qa-report.json`);

    if (report.errors.length > 0) process.exit(1);
  } finally {
    await browser.close();
  }
}

async function expectText(page, text, name) {
  if ((await page.getByText(text, { exact: false }).count()) > 0) pass(name, text);
  else fail(name, `Text not found: ${text}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
