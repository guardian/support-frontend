import "dotenv/config";
import { Page } from "@playwright/test";

export const fillInPayPalDetails = async (page: Page) => {
  const englishLink = page.getByRole("link", { name: "English" });
  if (await englishLink.isVisible()) {
    englishLink.click();
  }
  await page.getByPlaceholder("Email or mobile number").fill("doc@gu.co.uk");
  const nextButton = page.getByRole("button", { name: "Next" });
  if (await nextButton.isVisible()) {
    nextButton.click();
  }
  await page
    .getByPlaceholder("Password")
    .fill(`${process.env.PAYPAL_TEST_PASSWORD}`);
  const loginButton = page.getByRole("button", { name: "Log in" });
  if (await loginButton.isVisible()) {
    loginButton.click();
  }
  await page.getByRole("button", { name: /(Continue to Review Order|Agree \& Pay Now)/ }).click();
};

