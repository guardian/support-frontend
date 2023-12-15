import "dotenv/config";
import { Page } from "@playwright/test";

export const fillInPayPalDetails = async (page: Page) => {
  await page.locator("#email").fill("sb-k6ax328721376@personal.example.com");
  const nextButton = page.locator("#btnNext");
  if (await nextButton.isVisible()) {
    await nextButton.click();
  }
  await page.locator("#password")
    .fill(`${process.env.PAYPAL_TEST_PASSWORD}`);
  const loginButton = page.locator("#btnLogin");
  if (await loginButton.isVisible()) {
    await loginButton.click();
  }
  await page.locator("#payment-submit-btn").click();
};

