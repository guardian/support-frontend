import { expect, test } from "@playwright/test";
import { setTestCookies } from "./utils/cookies";
import { email, firstName, lastName } from "./utils/users";

test.beforeEach(async ({ page, context, baseURL }) => {
  const baseUrlWithFallback = baseURL ?? "https://support.theguardian.com";

});

test.describe("Paper product page", () => {
  test("Basic loading-when a user goes to the Newspapar Subscriptions page,it should display the page", async ({ page,baseURL,context }) => {
    const baseUrlWithFallback = baseURL ?? "https://support.theguardian.com";
    const pageUrl = `${baseUrlWithFallback}/uk/subscribe/paper`;
    const domain = new URL(pageUrl).hostname;
    await setTestCookies(context, firstName, domain);
    await page.goto(pageUrl, { waitUntil: "networkidle" });

    await page.locator('id=qa-paper-subscriptions').isVisible();
    await expect(page).toHaveURL(/\/uk\/subscribe\/paper/, { timeout: 60000 });

  });
});

test.describe("Weekly product page", () => {
  test("Basic loading-when a user goes to the Guardian Weekly page,it should display the page", async ({ page,baseURL,context }) => {
    const baseUrlWithFallback = baseURL ?? "https://support.theguardian.com";
    const pageUrl = `${baseUrlWithFallback}/uk/subscribe/weekly`;
    const domain = new URL(pageUrl).hostname;
    await setTestCookies(context, firstName, domain);
    await page.goto(pageUrl, { waitUntil: "networkidle" });

    await page.locator('id=qa-guardian-weekly').isVisible();
    await expect(page).toHaveURL(/\/uk\/subscribe\/weekly/, { timeout: 60000 });

  });
});

test.describe("Weekly gift product page", () => {
  test("Basic loading-when a user goes to the Guardian Weekly gift page,it should display the page", async ({ page,baseURL,context }) => {
    const baseUrlWithFallback = baseURL ?? "https://support.theguardian.com";
    const pageUrl = `${baseUrlWithFallback}/uk/subscribe/weekly/gift`;
    const domain = new URL(pageUrl).hostname;
    await setTestCookies(context, firstName, domain);
    await page.goto(pageUrl, { waitUntil: "networkidle" });

    await page.locator('id=qa-guardian-weekly-gift').isVisible();
    await expect(page).toHaveURL(/\/uk\/subscribe\/weekly\/gift/, { timeout: 60000 });

  });
});

test.describe("Subscriptions landing page", () => {
  test("Basic loading-when a user goes to the Subscriptions landing page,it should display the page", async ({ page,baseURL,context }) => {
    const baseUrlWithFallback = baseURL ?? "https://support.theguardian.com";
    const pageUrl = `${baseUrlWithFallback}/uk/subscribe`;
    const domain = new URL(pageUrl).hostname;
    await setTestCookies(context, firstName, domain);
    await page.goto(pageUrl, { waitUntil: "networkidle" });

    await page.locator('id=qa-subscriptions-landing-page').isVisible();
    await expect(page).toHaveURL(/\/uk\/subscribe/, { timeout: 60000 });

  });
});


