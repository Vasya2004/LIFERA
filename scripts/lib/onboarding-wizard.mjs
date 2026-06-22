export const ONBOARDING_CONFIRMATION =
  "Я понимаю, что Lifera создаст стартовую систему прогресса.";

export async function completeOnboardingWizard(page, { goalTitle, goalDescription = "" } = {}) {
  if (!goalTitle) {
    throw new Error("goalTitle is required for onboarding wizard QA");
  }

  await page.waitForURL(/\/onboarding/, { timeout: 30000 });

  await page.getByTestId("onboarding-continue").click();
  await page.getByRole("textbox", { name: "Название цели" }).fill(goalTitle);

  if (goalDescription) {
    await page.getByRole("textbox", { name: "Краткий контекст" }).fill(goalDescription);
  }

  await page.getByTestId("onboarding-continue").click();
  await page.getByTestId("onboarding-continue").click();
  await page.getByTestId("onboarding-continue").click();

  await page.getByRole("checkbox", { name: ONBOARDING_CONFIRMATION }).check();

  const onboardingComplete = page.waitForResponse(
    (response) =>
      response.url().includes("/api/onboarding/complete") && response.status() === 200,
    { timeout: 90000 },
  );

  await page.getByRole("button", { name: "Создать систему" }).click();
  await onboardingComplete;
}

export async function completeOnboardingWizardToDashboard(page, options) {
  await completeOnboardingWizard(page, options);
  await page.waitForURL(/\/(dashboard|plan)/, { timeout: 90000 });
}
