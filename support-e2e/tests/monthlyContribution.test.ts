import { expect, test } from "@playwright/test";
import { setTestCookies } from "./utils/cookies";
import { email, firstName, lastName } from "./utils/users";

test.beforeEach(async ({ page, context, baseURL }) => {
  const baseUrlWithFallback = baseURL ?? "https://support.theguardian.com";
  // We should remove the forcing into the ab test once this has been made live
  const pageUrl = `${baseUrlWithFallback}/uk/contribute#ab-twoStepCheckoutWithNudgeBelow=variant_a`;

  const domain = new URL(pageUrl).hostname;
  await setTestCookies(context, firstName, domain);
  await page.goto(pageUrl, { waitUntil: "networkidle" });
});

test.describe("Sign up for a Recurring Contribution (New Contributions Flow)", () => {
  test("Monthly contribution sign-up with Stripe - GBP", async ({ page }) => {
    await page.getByRole("tab").getByText("Monthly").click();
    await page.getByRole("button", { name: "Continue to checkout" }).click();

    await page.getByLabel("Email address").type(email);
    await page.getByLabel("First name").type(firstName);
    await page.getByLabel("Last name").type(lastName);

    await page.getByLabel("Credit/Debit card").click();

    // it would be nice to use aria style selectors here, but given Stripes
    // very secure implementation, it is quite hard
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

    await page.getByText(/Pay £([0-9]+) per month/).click();

    await expect(page).toHaveURL(/\/uk\/thankyou/, { timeout: 60000 });
  });
});
