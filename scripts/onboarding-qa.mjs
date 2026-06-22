#!/usr/bin/env node
/**
 * Stage 5 Onboarding Upgrade QA
 * Usage: node scripts/onboarding-qa.mjs
 * Env: ONBOARDING_QA_BASE_URL (default http://localhost:3000)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

import {
  ONBOARDING_CONFIRMATION,
  completeOnboardingWizard,
} from "./lib/onboarding-wizard.mjs";

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));

const baseUrl = process.env.ONBOARDING_QA_BASE_URL ?? "http://localhost:3000";
const timestamp = Date.now();
const testPassword = "OnboardingQaPass1!";
const userEmail = `onboardingqa${timestamp}@lifera.test`;
const goalTitle = `QA цель onboarding ${timestamp}`;

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

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { height: 844, width: 390 } });
  const page = await context.newPage();

  try {
    await page.goto(`${baseUrl}/register`, { waitUntil: "domcontentloaded" });
    await page.getByRole("textbox", { name: "Имя" }).fill("Onboarding QA");
    await page.getByRole("textbox", { name: "Email" }).fill(userEmail);
    await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
    await page.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
    await page.getByRole("button", { name: "Создать аккаунт" }).click();
    await page.waitForURL(/\/onboarding/, { timeout: 30000 });
    pass("Register → onboarding", page.url());

    const bodyText = await page.locator("body").innerText();
    if (bodyText.includes("Life RPG") || bodyText.includes("MVP") || bodyText.includes("v0.1")) {
      fail("No legacy copy", "found Life RPG / MVP labels");
    } else {
      pass("No legacy copy", "RU setup flow");
    }

    if (await page.getByText("Соберём вашу систему прогресса").isVisible()) {
      pass("Onboarding intro", "premium setup headline");
    } else {
      fail("Onboarding intro", "headline missing");
    }

    if (await page.getByText("Шаг 1 из 5").isVisible()) {
      pass("Mobile stepper", "compact step label");
    } else {
      fail("Mobile stepper", "step label missing");
    }

    await page.getByRole("button", { name: "Здоровье" }).click();
    await page.getByTestId("onboarding-continue").click();
    pass("Step 1 focus", "health selected");

    await page.getByRole("textbox", { name: "Название цели" }).fill(goalTitle);
    await page.getByTestId("onboarding-continue").click();
    pass("Step 2 goal", goalTitle);

    if (await page.getByText("7 дней системного старта").isVisible()) {
      pass("Step 3 mission", "recommended starter mission");
    } else {
      fail("Step 3 mission", "starter mission missing");
    }

    await page.getByTestId("onboarding-continue").click();
    if (await page.getByText("Добавьте стартовые ритуалы").isVisible()) {
      pass("Step 4 rituals", "ritual picker visible");
    } else {
      fail("Step 4 rituals", "ritual step missing");
    }

    await page.getByTestId("onboarding-continue").click();
    if (await page.getByText("Ваша стартовая система").isVisible()) {
      pass("Step 5 preview", "system preview visible");
    } else {
      fail("Step 5 preview", "preview step missing");
    }

    await page.getByRole("checkbox", { name: ONBOARDING_CONFIRMATION }).check();
    const onboardingComplete = page.waitForResponse(
      (response) =>
        response.url().includes("/api/onboarding/complete") && response.status() === 200,
      { timeout: 90000 },
    );
    await page.getByRole("button", { name: "Создать систему" }).click();
    await onboardingComplete;
    await page.waitForURL(/\/dashboard/, { timeout: 90000 });
    pass("Submit + redirect", page.url());

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    if (scrollWidth <= clientWidth + 1) {
      pass("Mobile scroll", `${scrollWidth}px ≤ ${clientWidth}px`);
    } else {
      fail("Mobile scroll", `overflow ${scrollWidth} > ${clientWidth}`);
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (url && serviceRoleKey) {
      const admin = createClient(url, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const { data: users } = await admin.auth.admin.listUsers({ perPage: 200 });
      const user = users?.users?.find((item) => item.email === userEmail);

      if (user) {
        const { data: profile } = await admin
          .from("user_profiles")
          .select("onboarding_completed, selected_life_areas")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profile?.onboarding_completed) pass("Profile onboarding_completed", "true");
        else fail("Profile onboarding_completed", String(profile?.onboarding_completed));

        if ((profile?.selected_life_areas ?? []).includes("health")) {
          pass("Selected life area", "health");
        } else {
          fail("Selected life area", JSON.stringify(profile?.selected_life_areas));
        }

        const { count: goalCount } = await admin
          .from("goals")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        if ((goalCount ?? 0) === 1) pass("Goal count", String(goalCount));
        else fail("Goal count", String(goalCount));

        const { count: challengeCount } = await admin
          .from("challenges")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        if ((challengeCount ?? 0) === 1) pass("Mission count", String(challengeCount));
        else fail("Mission count", String(challengeCount));

        const { count: habitCount } = await admin
          .from("habits")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        if ((habitCount ?? 0) >= 1 && (habitCount ?? 0) <= 3) {
          pass("Starter rituals created", String(habitCount));
        } else {
          fail("Starter rituals created", String(habitCount));
        }

        await page.goto(`${baseUrl}/onboarding`, { waitUntil: "domcontentloaded" });
        const resubmit = await page.request.post(`${baseUrl}/api/onboarding/complete`, {
          data: {
            challenge_title: "7 дней системного старта",
            goal_title: `${goalTitle} duplicate`,
            selected_life_areas: ["health"],
            starter_rituals: ["10 минут прогулки"],
          },
        });

        if (resubmit.ok()) pass("Idempotent API resubmit", "200 OK");
        else fail("Idempotent API resubmit", String(resubmit.status()));

        const { count: goalCountAfter } = await admin
          .from("goals")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);
        const { count: habitCountAfter } = await admin
          .from("habits")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        if ((goalCountAfter ?? 0) === 1 && (habitCountAfter ?? 0) === habitCount) {
          pass("Idempotent resubmit", "no duplicate goal/rituals");
        } else {
          fail(
            "Idempotent resubmit",
            `goals=${goalCountAfter}, habits=${habitCountAfter}`,
          );
        }
      } else {
        fail("Supabase user lookup", "user not found");
      }
    } else {
      fail("Supabase admin checks", "missing service role env");
    }

    const proPage = await context.newPage();
    const proEmail = `onboardingpro${timestamp}@lifera.test`;
    await proPage.goto(`${baseUrl}/register?plan=pro`, { waitUntil: "domcontentloaded" });
    await proPage.getByRole("textbox", { name: "Имя" }).fill("Onboarding Pro QA");
    await proPage.getByRole("textbox", { name: "Email" }).fill(proEmail);
    await proPage.getByRole("textbox", { name: "Пароль", exact: true }).fill(testPassword);
    await proPage.getByRole("textbox", { name: "Повторите пароль" }).fill(testPassword);
    await proPage.getByRole("button", { name: "Создать аккаунт" }).click();
    await proPage.waitForURL(/\/onboarding/, { timeout: 30000 });
    await completeOnboardingWizard(proPage, { goalTitle: `Pro plan ${timestamp}` });
    await proPage.waitForURL(/\/plan\?selected=pro/, { timeout: 90000 });
    pass("Intended plan redirect", proPage.url());
  } finally {
    await browser.close();
  }

  console.log(`\nOnboarding QA: ${report.checks.length} checks, ${report.errors.length} errors`);
  if (report.errors.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
