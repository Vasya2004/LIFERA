#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { chromium } from "playwright";

const root = process.cwd();
const outDir = path.join(root, "diploma-screenshots");
const publicUploadsDir = path.join(root, "public", "uploads");
const baseUrl = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";
const demoEmail = "lifera.diploma.demo@example.com";
const demoPassword = "DiplomaDemoPass1!";
const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };

loadEnvFile(path.join(root, ".env.local"));
loadEnvFile(path.join(root, ".env"));

const report = {
  captured: [],
  copied: [],
  issues: [],
};

const appScreenshots = [
  ["lifera-dashboard.png", "/dashboard"],
  ["lifera-goals.png", "/goals"],
  ["lifera-wishlist.png", "/goals/wishes"],
  ["lifera-missions.png", "/habits"],
  ["lifera-skills.png", "/skills"],
  ["lifera-health.png", "/health"],
  ["lifera-finance.png", "/finance"],
  ["lifera-achievements.png", "/achievements"],
  ["lifera-ai-assistant.png", "/ai-assistant"],
  ["lifera-profile-settings.png", "/profile"],
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function ensureDirs() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(publicUploadsDir, { recursive: true });
}

async function ensureDemoUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  const admin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let page = 1;
  let existing = null;

  while (!existing) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw new Error(error.message);
    existing = data.users.find((user) => user.email?.toLowerCase() === demoEmail);
    if (existing || data.users.length < 100) break;
    page += 1;
  }

  if (existing) {
    const { error } = await admin.auth.admin.updateUserById(existing.id, {
      email_confirm: true,
      password: demoPassword,
      user_metadata: { full_name: "Алексей" },
    });
    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await admin.auth.admin.createUser({
    email: demoEmail,
    email_confirm: true,
    password: demoPassword,
    user_metadata: { full_name: "Алексей" },
  });

  if (error) throw new Error(error.message);
}

function runSeed() {
  const result = spawnSync("node", ["scripts/seed-lifera-demo.mjs"], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.status !== 0) {
    throw new Error(`seed-lifera-demo failed:\n${result.stdout}\n${result.stderr}`);
  }

  process.stdout.write(result.stdout);
}

async function preparePage(page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        caret-color: transparent !important;
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 0.001ms !important;
      }
    `,
  }).catch(() => {});
}

async function gotoReady(page, route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 90000 });
  await preparePage(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

async function assertCleanPage(page, label) {
  const text = await page.locator("body").innerText().catch(() => "");
  if (text.includes("Application error")) {
    report.issues.push(`${label}: Application error visible`);
  }
  if (/\bNaN\b|\bundefined\b/.test(text)) {
    report.issues.push(`${label}: NaN/undefined visible`);
  }

  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  if (overflow.scrollWidth > overflow.clientWidth + 2) {
    report.issues.push(`${label}: horizontal overflow ${overflow.scrollWidth} > ${overflow.clientWidth}`);
  }
}

async function capture(page, filename, options = {}) {
  const filePath = path.join(outDir, filename);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  await page.screenshot({
    fullPage: false,
    path: filePath,
    type: "png",
    ...options,
  });
  fs.copyFileSync(filePath, path.join(publicUploadsDir, filename));
  report.captured.push(filename);
  report.copied.push(`public/uploads/${filename}`);
  console.log(`Captured ${filename}`);
}

async function login(page) {
  await gotoReady(page, "/login");
  await page.locator('input[name="email"]').fill(demoEmail);
  await page.locator('input[name="password"]').fill(demoPassword);
  await page.getByRole("button", { name: "Войти" }).click();
  await page.waitForURL(/\/onboarding|\/dashboard|\/plan/, { timeout: 60000 });
  await page.waitForLoadState("networkidle");
}

async function captureOnboarding(page) {
  await gotoReady(page, "/onboarding");

  await page.getByRole("button", { name: "Личные проекты" }).click().catch(() => {});
  await page.locator('input[name="goal_title"]').fill("Собрать личную систему прогресса").catch(() => {});
  await page.locator('textarea[name="goal_description"]').fill("Навести порядок в целях, привычках, здоровье и финансах.").catch(() => {});
  await page.getByRole("button", { name: /7 дней системного старта/ }).click().catch(() => {});

  await assertCleanPage(page, "onboarding");
  await capture(page, "lifera-onboarding.png");
}

async function hideSensitiveProfileData(page) {
  await page.evaluate(() => {
    const patterns = [/email/i, /почт/i, /lifera\.diploma\.demo/i];
    for (const element of document.querySelectorAll("body *")) {
      const text = element.textContent ?? "";
      if (patterns.some((pattern) => pattern.test(text)) && element.children.length === 0) {
        element.textContent = text.replace(/lifera\.diploma\.demo@example\.com/g, "demo@example.com");
      }
    }
  });
}

async function captureRoute(page, filename, route) {
  await gotoReady(page, route);
  if (filename === "lifera-profile-settings.png") {
    await hideSensitiveProfileData(page);
  }
  await assertCleanPage(page, route);
  await capture(page, filename);
}

async function captureDocumentBoard(page, filename, bodyHtml) {
  await page.setViewportSize(desktop);
  await page.setContent(
    `<!doctype html>
    <html lang="ru">
      <head>
        <meta charset="utf-8" />
        <style>
          :root { color-scheme: dark; }
          body {
            margin: 0;
            width: 1440px;
            min-height: 900px;
            background: #09090b;
            color: #f8fafc;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }
          .stage {
            min-height: 900px;
            padding: 56px 72px;
            box-sizing: border-box;
            background:
              radial-gradient(circle at 20% 0%, rgba(255,90,31,0.18), transparent 28%),
              radial-gradient(circle at 85% 12%, rgba(16,185,129,0.13), transparent 28%),
              linear-gradient(135deg, #111113 0%, #09090b 58%, #130906 100%);
          }
          .header { display: flex; align-items: center; justify-content: space-between; gap: 32px; margin-bottom: 42px; }
          .brand { display: flex; align-items: center; gap: 16px; }
          .mark { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05); }
          .word { font-size: 38px; font-weight: 800; letter-spacing: 0.02em; }
          .pill { border: 1px solid rgba(255,90,31,0.35); border-radius: 999px; padding: 10px 18px; color: #ffb08f; background: rgba(255,90,31,0.08); font-size: 15px; font-weight: 700; }
          .grid { display: grid; gap: 20px; }
          .cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
          .card { border: 1px solid rgba(255,255,255,0.10); border-radius: 28px; padding: 26px; background: rgba(24,24,27,0.78); box-shadow: 0 20px 70px rgba(0,0,0,0.25); }
          .muted { color: #a1a1aa; }
          .accent { color: #ff5a1f; }
          h1 { margin: 0; font-size: 46px; line-height: 1.05; letter-spacing: -0.03em; }
          h2 { margin: 0 0 10px; font-size: 22px; }
          h3 { margin: 0 0 8px; font-size: 17px; }
          p { margin: 0; line-height: 1.55; }
          .node { border: 1px solid rgba(255,255,255,0.12); border-radius: 22px; padding: 18px; background: rgba(255,255,255,0.045); min-height: 88px; }
          .node strong { display: block; margin-bottom: 6px; font-size: 17px; }
          .arrow { color: #ff5a1f; font-size: 28px; text-align: center; align-self: center; }
          .table { border-radius: 22px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.045); padding: 16px; }
          .table h3 { color: #fff; }
          .fields { display: grid; gap: 6px; margin-top: 10px; color: #a1a1aa; font-size: 13px; }
          .swatch { height: 116px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.12); }
        </style>
      </head>
      <body>${bodyHtml}</body>
    </html>`,
    { waitUntil: "load" },
  );
  await capture(page, filename);
}

async function captureBrandBoard(page) {
  await captureDocumentBoard(
    page,
    "brand-board-lifera.png",
    `<main class="stage">
      <div class="header">
        <div class="brand">
          <div class="mark"><img src="${baseUrl}/brand/lifera-mark.svg" width="34" style="filter: invert(1)" /></div>
          <div class="word">LIFERA</div>
        </div>
        <div class="pill">Life RPG · goals · missions · progress</div>
      </div>
      <div class="grid cols-3" style="align-items: stretch;">
        <section class="card" style="grid-column: span 2;">
          <h1>Персональная Life RPG-система для целей и прогресса</h1>
          <p class="muted" style="margin-top: 18px; max-width: 760px;">Бренд Lifera сочетает тёмную premium-панель, чистые dashboard-карточки, оранжевый action-accent и спокойную типографику для ежедневной работы.</p>
        </section>
        <section class="card">
          <h2>Тон продукта</h2>
          <p class="muted">Собранный, технологичный, поддерживающий. Без игровой инфантильности, но с понятным прогрессом.</p>
        </section>
      </div>
      <div class="grid cols-4" style="margin-top: 22px;">
        <div><div class="swatch" style="background:#ff5a1f"></div><p style="margin-top:10px;font-weight:700">Accent #FF5A1F</p></div>
        <div><div class="swatch" style="background:#09090b"></div><p style="margin-top:10px;font-weight:700">Dark #09090B</p></div>
        <div><div class="swatch" style="background:#18181b"></div><p style="margin-top:10px;font-weight:700">Surface #18181B</p></div>
        <div><div class="swatch" style="background:#10b981"></div><p style="margin-top:10px;font-weight:700">Progress #10B981</p></div>
      </div>
      <div class="grid cols-5" style="margin-top: 22px;">
        ${["Цели", "Миссии", "Навыки", "Финансы", "Ассистент"].map((item) => `<div class="node"><strong>${item}</strong><span class="muted">модуль Life OS</span></div>`).join("")}
      </div>
    </main>`,
  );
}

async function captureArchitecture(page) {
  await captureDocumentBoard(
    page,
    "lifera-architecture.png",
    `<main class="stage">
      <div class="header">
        <div><h1>Архитектура Lifera</h1><p class="muted" style="margin-top:12px">Next.js App Router · Supabase Auth/PostgreSQL · domain services</p></div>
        <div class="pill">server-side rules</div>
      </div>
      <div class="grid cols-3">
        <section class="card"><h2>Frontend</h2><div class="grid">${["Landing", "Protected App Shell", "Dashboard cards", "Forms & modals"].map((x) => `<div class="node"><strong>${x}</strong><span class="muted">React components</span></div>`).join("")}</div></section>
        <section class="card"><h2>Application Layer</h2><div class="grid">${["Route Handlers", "Server Actions", "Middleware", "Domain modules"].map((x) => `<div class="node"><strong>${x}</strong><span class="muted">Next.js server runtime</span></div>`).join("")}</div></section>
        <section class="card"><h2>Data Layer</h2><div class="grid">${["Supabase Auth", "PostgreSQL + RLS", "Storage-ready assets", "Service role writes"].map((x) => `<div class="node"><strong>${x}</strong><span class="muted">secure persistence</span></div>`).join("")}</div></section>
      </div>
      <section class="card" style="margin-top:22px">
        <h2>Core loop</h2>
        <div class="grid cols-5" style="margin-top:16px">
          <div class="node"><strong>Goal</strong><span class="muted">strategic result</span></div>
          <div class="node"><strong>Mission</strong><span class="muted">regular action</span></div>
          <div class="node"><strong>XP</strong><span class="muted">server-awarded</span></div>
          <div class="node"><strong>Achievement</strong><span class="muted">milestone</span></div>
          <div class="node"><strong>Assistant</strong><span class="muted">next step</span></div>
        </div>
      </section>
    </main>`,
  );
}

async function captureErDiagram(page) {
  const tables = [
    ["user_profiles", ["user_id", "xp_total", "level", "primary_goal_id"]],
    ["goals", ["user_id", "title", "life_area", "progress"]],
    ["habits", ["user_id", "linked_goal_id", "linked_skill_id", "xp_reward"]],
    ["habit_logs", ["user_id", "habit_id", "completed_on", "xp_awarded"]],
    ["skills", ["user_id", "title", "category", "xp_total"]],
    ["wishes", ["user_id", "linked_goal_id", "target_amount", "status"]],
    ["health_metrics", ["user_id", "metric_type", "value", "date"]],
    ["finance_metrics", ["user_id", "metric_type", "value", "date"]],
    ["achievements", ["user_id", "condition_type", "status", "xp_reward"]],
    ["ai_recommendations", ["user_id", "title", "content", "created_at"]],
    ["subscriptions", ["user_id", "plan", "status", "provider"]],
    ["xp_transactions", ["user_id", "source_type", "source_id", "amount"]],
  ];

  await captureDocumentBoard(
    page,
    "lifera-er-diagram.png",
    `<main class="stage">
      <div class="header">
        <div><h1>ER-диаграмма Lifera</h1><p class="muted" style="margin-top:12px">Ключевые таблицы пользовательского контура и связи по user_id.</p></div>
        <div class="pill">Supabase PostgreSQL + RLS</div>
      </div>
      <div class="grid cols-4">
        ${tables.map(([name, fields]) => `<div class="table"><h3>${name}</h3><div class="fields">${fields.map((field) => `<span>${field}</span>`).join("")}</div></div>`).join("")}
      </div>
    </main>`,
  );
}

async function main() {
  ensureDirs();
  await ensureDemoUser();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    colorScheme: "dark",
    deviceScaleFactor: 1,
    locale: "ru-RU",
    viewport: desktop,
  });
  const page = await context.newPage();

  try {
    await captureBrandBoard(page);
    await captureArchitecture(page);
    await captureErDiagram(page);

    await gotoReady(page, "/");
    await assertCleanPage(page, "landing");
    await capture(page, "lifera-landing.png");

    await gotoReady(page, "/pricing");
    await assertCleanPage(page, "pricing");
    await capture(page, "lifera-pricing.png");

    await gotoReady(page, "/login");
    await assertCleanPage(page, "auth");
    await capture(page, "lifera-auth.png");

    await login(page);
    await captureOnboarding(page);

    runSeed();

    await page.setViewportSize(desktop);
    for (const [filename, route] of appScreenshots) {
      await captureRoute(page, filename, route);
    }

    await page.setViewportSize(mobile);
    await captureRoute(page, "lifera-mobile-pwa.png", "/dashboard");
  } finally {
    await browser.close();
  }

  console.log("\n--- Prism diploma screenshots ---");
  console.log(`Output: ${outDir}`);
  console.log(`Uploads copy: ${publicUploadsDir}`);
  console.log(`Captured: ${report.captured.length}`);

  if (report.issues.length > 0) {
    console.log("Issues:");
    for (const issue of report.issues) console.log(`- ${issue}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
