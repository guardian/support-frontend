import { expect, test } from "@playwright/test";
import { setTestCookies } from "./utils/cookies";
import { email, firstName, lastName } from "./utils/users";

test.beforeEach(async ({ page, context, baseURL }) => {
  const baseUrlWithFallback = baseURL ?? "https://support.theguardian.com";
  // We should remove the forcing into the ab test once this has been made live
  const pageUrl = `${baseUrlWithFallback}/au/contribute#ab-twoStepCheckoutWithNudgeBelow=variant_a`;

  const domain = new URL(pageUrl).hostname;
  await setTestCookies(context, firstName, domain);
  await page.goto(pageUrl, { waitUntil: "networkidle" });
});

test.describe("Sign up for a one-off contribution (New Contributions Flow)", () => {
  test("One-off contribution sign-up with Stripe - AUD", async ({ page, baseURL, context}) => {

    await page.getByRole("tab").getByText("Single").click();

    await page.locator('label[for=\'amount-other\']').click();

    await page.getByLabel("Enter your amount").type("22.55");
    await page.getByRole("button", { name: "Continue to checkout" }).click();

    await page.getByLabel("Email address").type(email);

    await page.getByRole('radio', { name: 'Credit/Debit card' }).click();

    await page
      .frameLocator("#cardNumber iframe")
      .locator('input[name="cardnumber"]')
      .fill("4242424242424242");

    await page
      .frameLocator("#expiry iframe")
      .locator('input[name="exp-date"]')
      .fill("01/50");

    await page
      .frameLocator("#cvc iframe")
      .locator('input[name="cvc"]')
      .fill("123");

    await expect(
      await page
        .frameLocator('[title="reCAPTCHA"]')
        .locator("#recaptcha-anchor-label"),
    ).toBeVisible();

    const recaptchaIframe = page.frameLocator('[title="reCAPTCHA"]');
    const recaptchaCheckbox = recaptchaIframe.locator(".recaptcha-checkbox");
    await expect(recaptchaCheckbox).toBeEnabled();

    await recaptchaCheckbox.click();
    await expect(
      recaptchaIframe.locator("#recaptcha-accessible-status"),
    ).toContainText("You are verified");

    await page.locator('button:has-text("Support us with")').click();

    await expect(page).toHaveURL(/\/au\/thankyou/, { timeout: 600000 });
  });
});

test.describe("Sign up for a one-off contribution (New Contributions Flow)", () => {
  test("Check browser navigates to paypal", async ({ page,baseURL,context }) => {

    await page.getByRole("tab").getByText("Single").click();
    await page.getByRole("button", { name: "Continue to checkout" }).click();

    await page.getByLabel("Email address").type(email);

    await page.getByRole('radio', { name: 'Paypal' }).click();

    await page.locator('button:has-text("Pay")').click();

    await expect(page).toHaveURL(/.*paypal.com/,{ timeout: 600000 });

  });
});
