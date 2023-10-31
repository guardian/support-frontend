import { expect, test } from "@playwright/test";
import { setTestCookies } from "./utils/cookies";
import {  firstName  } from "./utils/users";
import {setTestUserDetails} from "./utils/testUserDetails";
import {checkRecaptcha} from "./utils/recaptcha";
import {fillInCardDetails} from "./utils/cardDetails";
import {fillInDirectDebitDetails} from "./utils/directDebitDetails";


test.beforeEach(async ({ page, context, baseURL }) => {

  const baseUrlWithFallback = baseURL ?? "https://support.theguardian.com";
  // We should remove the forcing into the ab test once this has been made live
  const pageUrl = `${baseUrlWithFallback}/uk/contribute`;

  const domain = new URL(pageUrl).hostname;
  await setTestCookies(context, firstName, domain);
  await page.goto(pageUrl, { waitUntil: "networkidle" });
});

test.describe("Sign up for a Recurring Contribution (Two-Step checkout)", () => {
  test("Monthly contribution sign-up with Stripe - GBP", async ({ page }) => {

    await page.getByRole("tab").getByText("Monthly").click();
    await page.getByRole("button", { name: "Continue to checkout" }).click();

    await setTestUserDetails(page);

    await page.getByLabel("Credit/Debit card").click();

    await fillInCardDetails(page);

    await checkRecaptcha(page);

    await page.getByText(/Pay £([0-9]+) per month/).click();

    await expect(page).toHaveURL(/\/uk\/thankyou/, { timeout: 600000 });
  });

  test("Monthly contribution sign-up with direct debit - GBP", async ({ page }) => {
    await page.getByRole("tab").getByText("Monthly").click();
    await page.getByRole("button", { name: "Continue to checkout" }).click();

    await setTestUserDetails(page);

    await page.getByRole('radio', { name: 'Direct debit' }).click();

    await fillInDirectDebitDetails(page);

    await checkRecaptcha(page);

    await page.getByText(/Pay £([0-9]+) per month/).click();

    await expect(page).toHaveURL(/\/uk\/thankyou/, { timeout: 600000 });
  });

  test("Annual contribution sign-up with Stripe - USD", async ({ page,baseURL,context }) => {

    await page.getByRole("button", { name: "Select a country" }).click();
    await page.getByRole('link', { name: 'United States US$' }).click();

    await page.getByRole("tab").getByText("Annual").click();
    await page.getByRole("button", { name: "Continue to checkout" }).click();

    await setTestUserDetails(page);

    await page.getByLabel("State").type("NY");
    await page.getByLabel("ZIP code").type("90210");

    await page.getByRole('radio', { name: 'Credit/Debit card' }).click();

    await fillInCardDetails(page);

    await checkRecaptcha(page);

    await page.locator('button:has-text("Support us with")').click();

    await expect(page).toHaveURL(/\/us\/thankyou/, { timeout: 600000 });
  });

});

