import { expect, test } from "@playwright/test";
import { setTestCookies } from "./utils/cookies";
import {email, firstName} from "./utils/users";
import {checkRecaptcha} from "./utils/recaptcha";
import {fillInCardDetails} from "./utils/cardDetails";

test.beforeEach(async ({ page, context, baseURL }) => {
  const baseUrlWithFallback = baseURL ?? "https://support.theguardian.com";
  // We should remove the forcing into the ab test once this has been made live
  const pageUrl = `${baseUrlWithFallback}/au/contribute`;

  const domain = new URL(pageUrl).hostname;
  await setTestCookies(context, firstName, domain);
  await page.goto(pageUrl, { waitUntil: "networkidle" });
});

test.describe("Sign up for a one-off contribution (Two-Step checkout)", () => {
  test("One-off contribution sign-up with Stripe - AUD", async ({ page}) => {

    await page.getByRole("tab").getByText("One-time").click();

    await page.locator("label[for='amount-other']").click();

    await page.getByLabel("Enter your amount").type("22.55");
    await page.getByRole("button", { name: "Continue to checkout" }).click();

    await page.getByLabel("Email address").type(email);

    await page.getByRole('radio', { name: 'Credit/Debit card' }).click();

    await fillInCardDetails(page);

    await checkRecaptcha(page);

    await page.locator('button:has-text("Support us with")').click();

    await expect(page).toHaveURL(/\/au\/thankyou/, { timeout: 600000 });
  });
});

test.describe("Sign up for a one-off contribution (Two-Step checkout)", () => {
  test("Check browser navigation to paypal", async ({ page, }) => {

    await page.getByRole("tab").getByText("One-time").click();
    await page.getByRole("button", { name: "Continue to checkout" }).click();

    await page.getByLabel("Email address").type(email);

    await page.getByRole('radio', { name: 'Paypal' }).click();

    await page.locator('button:has-text("Pay")').click();

    await expect(page).toHaveURL(/.*paypal.com/,{ timeout: 600000 });

  });
});
