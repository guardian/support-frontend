import { expect, test } from "@playwright/test";
import { afterEachTasks } from "./utils/afterEachTest";
import { setTestCookies } from "./utils/cookies";
import { firstName } from "./utils/users";

afterEachTasks(test);

test.describe("Paper product page", () => {
  test("Basic loading-when a user goes to the Newspapar Subscriptions page,it should display the page", async ({
    baseURL,
    context,
  }) => {
    const page = await context.newPage();
    const baseUrlWithFallback = baseURL ?? "https://support.theguardian.com";
    const pageUrl = `${baseUrlWithFallback}/uk/subscribe/paper`;
    const domain = new URL(pageUrl).hostname;
    await setTestCookies(context, firstName(), domain);
    await page.goto(pageUrl);
    await page.locator("id=qa-paper-subscriptions").isVisible();
    await expect(page).toHaveURL(/\/uk\/subscribe\/paper/);
  });
});

test.describe("Weekly product page", () => {
  test("Basic loading-when a user goes to the Guardian Weekly page,it should display the page", async ({
    baseURL,
    context,
  }) => {
    const page = await context.newPage();
    const baseUrlWithFallback = baseURL ?? "https://support.theguardian.com";
    const pageUrl = `${baseUrlWithFallback}/uk/subscribe/weekly`;
    const domain = new URL(pageUrl).hostname;
    await setTestCookies(context, firstName(), domain);
    await page.goto(pageUrl);

    await page.locator("id=qa-guardian-weekly").isVisible();
    await expect(page).toHaveURL(/\/uk\/subscribe\/weekly/);
  });
});

test.describe("Weekly gift product page", () => {
  test("Basic loading-when a user goes to the Guardian Weekly gift page,it should display the page", async ({
    baseURL,
    context,
  }) => {
    const page = await context.newPage();
    const baseUrlWithFallback = baseURL ?? "https://support.theguardian.com";
    const pageUrl = `${baseUrlWithFallback}/uk/subscribe/weekly/gift`;
    const domain = new URL(pageUrl).hostname;
    await setTestCookies(context, firstName(), domain);
    await page.goto(pageUrl);

    await page.locator("id=qa-guardian-weekly-gift").isVisible();
    await expect(page).toHaveURL(/\/uk\/subscribe\/weekly\/gift/);
  });
});

test.describe("Subscriptions landing page", () => {
  test("Basic loading-when a user goes to the Subscriptions landing page,it should display the page", async ({
    baseURL,
    context,
  }) => {
    const page = await context.newPage();
    const baseUrlWithFallback = baseURL ?? "https://support.theguardian.com";
    const pageUrl = `${baseUrlWithFallback}/uk/subscribe`;
    const domain = new URL(pageUrl).hostname;
    await setTestCookies(context, firstName(), domain);
    await page.goto(pageUrl);

    await page.locator("id=qa-subscriptions-landing-page").isVisible();
    await expect(page).toHaveURL(/\/uk\/subscribe/);
  });
});
