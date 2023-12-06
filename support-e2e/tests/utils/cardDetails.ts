import { Page } from "@playwright/test";

export const fillInCardDetails = async (page: Page) => {
  // it would be nice to use aria style selectors here, but given Stripes
  // very secure implementation, it is quite hard
  await page
    .frameLocator("iframe[title='Secure card number input frame']")
    .locator('input[name="cardnumber"]')
    .fill("4242424242424242");

  await page
    .frameLocator("iframe[title='Secure expiration date input frame']")
    .locator('input[name="exp-date"]')
    .fill("01/50");

  await page
    .frameLocator("iframe[title='Secure CVC input frame']")
    .locator('input[name="cvc"]')
    .fill("123");
};
