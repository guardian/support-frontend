import { expect, test } from "@playwright/test";
import { setTestCookies } from "./utils/cookies";
import { email, firstName, lastName } from "./utils/users";

test.beforeEach(async ({ page, context, baseURL }) => {
  const baseUrlWithFallback = baseURL ?? "https://support.theguardian.com";
  const pageUrl = `${baseUrlWithFallback}/uk/contribute#ab-twoStepCheckoutWithNudgeBelow=variant_a`;

  const domain = new URL(pageUrl).hostname;
  await setTestCookies(context, firstName, domain);
  await page.goto(pageUrl, { waitUntil: "networkidle" });
});

test.describe("Sign up for a Recurring Contribution (New Contributions Flow)", () => {
  test("Monthly contribution sign-up with Stripe - GBP", async ({ page }) => {
    const monthlyTab = "#MONTHLY";
    await page.locator(monthlyTab).click();

    await page.locator("#email").type(email);
    await page.locator("#firstName").type(firstName);
    await page.locator("#lastName").type(lastName);

    await page.locator("#qa-credit-card").click();

    await expect(
      await page
        .frameLocator('[title="reCAPTCHA"]')
        .locator("#recaptcha-anchor-label"),
    ).toBeVisible();

    const cardNumber = page
      .frameLocator("#cardNumber iframe")
      .locator('input[name="cardnumber"]');
    await cardNumber.fill("4242424242424242");

    const expiryDate = page
      .frameLocator("#expiry iframe")
      .locator('input[name="exp-date"]');
    await expiryDate.fill("01/50");

    const cvc = page.frameLocator("#cvc iframe").locator('input[name="cvc"]');
    await cvc.fill("123");

    const recaptchaIframe = page.frameLocator('[title="reCAPTCHA"]');
    const recaptchaCheckbox = recaptchaIframe.locator(".recaptcha-checkbox");
    await expect(recaptchaCheckbox).toBeEnabled();

    await recaptchaCheckbox.click();
    await expect(
      recaptchaIframe.locator("#recaptcha-accessible-status"),
    ).toContainText("You are verified");

    const contributeButton =
      "#qa-contributions-landing-submit-contribution-button";

    await expect(page.locator(contributeButton)).toContainText(
      /Pay £([0-9]+) per month/,
    );

    await page.locator(contributeButton).click();

    await expect(page).toHaveURL(/\/uk\/thankyou/, { timeout: 60000 });
  });
});
