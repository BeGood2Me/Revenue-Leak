import { test, expect } from "@playwright/test";

const NICHE_SELECTORS = [
  { id: "saas", label: /B2B or B2C software/i },
  { id: "ecommerce", label: /Online stores and DTC/i },
  { id: "agency", label: /Marketing, consulting/i },
  { id: "service", label: /Local or appointment-based/i },
] as const;

async function completeSaasWizard(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: /B2B or B2C software/i }).click();

  await page.getByRole("button", { name: /Not sure — show me everything/i }).click();
  await page.getByRole("button", { name: "10,000 – 50,000" }).click();
  await page.getByRole("button", { name: "200 – 1,000" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  await page.getByLabel(/Visitor-to-signup rate/i).fill("3");
  await page.getByLabel(/Trial-to-paid conversion rate/i).fill("5");
  await page.getByLabel(/Monthly churn rate/i).fill("8");
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  await page.getByLabel(/Failed payment rate/i).fill("4");
  await page.getByRole("button", { name: "No", exact: true }).click();
  await page.getByRole("button", { name: "$100 – $300" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  await page.getByRole("button", { name: /Under 1 hour/i }).click();
  await page.getByRole("button", { name: /None — single plan only/i }).click();
  await page.getByRole("button", { name: "Continue to results" }).click();
}

test.describe("Revenue Leak funnel", () => {
  test("landing page loads diagnostic funnel", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Find the top 3 places/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /What type of business are you/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Privacy" })).toBeVisible();
  });

  test("SaaS wizard reaches preview after email", async ({ page }) => {
    await page.goto("/#start");
    await completeSaasWizard(page);

    await expect(page.getByRole("heading", { name: /Almost there/i })).toBeVisible();
    await page.getByLabel(/Email address/i).fill("e2e@example.com");
    await page.getByRole("button", { name: "See my results" }).click();

    const preview = page.locator("#preview-results");
    await expect(preview).toBeVisible();
    await expect(preview.getByText(/Estimated monthly revenue loss/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Unlock full report —/i })).toBeVisible();
    await expect(preview.getByText(/Funnel health/i)).toBeVisible();
  });

  test("unlock button redirects to Stripe when configured", async ({ page }) => {
    await page.goto("/#start");
    await completeSaasWizard(page);
    await page.getByLabel(/Email address/i).fill("checkout-e2e@example.com");
    await page.getByRole("button", { name: "See my results" }).click();
    await expect(page.locator("#preview-results")).toBeVisible();

    await Promise.all([
      page.waitForURL(/checkout\.stripe\.com/, { timeout: 20_000 }),
      page.getByRole("button", { name: /Unlock full report —/i }).click(),
    ]);
  });

  for (const niche of NICHE_SELECTORS) {
    test(`new ${niche.id} diagnostic hides prior preview`, async ({ page }) => {
      await page.goto("/#start");
      await completeSaasWizard(page);
      await page.getByLabel(/Email address/i).fill(`restart-${niche.id}@example.com`);
      await page.getByRole("button", { name: "See my results" }).click();
      await expect(page.locator("#preview-results")).toBeVisible();

      await page.getByRole("button", { name: /Start over with a new diagnostic/i }).click();
      await expect(page.getByRole("heading", { name: /What type of business are you/i })).toBeVisible();
      await expect(page.getByText(/Loading your diagnostic/i)).toHaveCount(0);
      await expect(page.locator("#preview-results")).toHaveCount(0);

      await page.getByRole("button", { name: niche.label }).click();
      await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeVisible();
      await expect(page.getByText(/Loading your diagnostic/i)).toHaveCount(0);
      await expect(page.locator("#preview-results")).toHaveCount(0);
      await expect(page.getByText(/All leak categories/i)).toHaveCount(0);
    });
  }

  test("header start diagnostic clears saved preview", async ({ page }) => {
    await page.goto("/#start");
    await completeSaasWizard(page);
    await page.getByLabel(/Email address/i).fill("fresh-start@example.com");
    await page.getByRole("button", { name: "See my results" }).click();
    await expect(page.locator("#preview-results")).toBeVisible();

    await page.getByRole("link", { name: "Start diagnostic" }).click();
    await expect(page.getByRole("heading", { name: /What type of business are you/i })).toBeVisible();
    await expect(page.getByText(/Loading your diagnostic/i)).toHaveCount(0);
    await expect(page.locator("#preview-results")).toHaveCount(0);
  });
});
