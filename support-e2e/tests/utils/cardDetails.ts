import { Page } from "@playwright/test";

export const fillInCardDetails = async (
  page:Page,
) => {
  // it would be nice to use aria style selectors here, but given Stripes
  // very secure implementation, it is quite hard
  await page
    .frameLocator("#card-number iframe")
    .locator('input[name="cardnumber"]')
    .fill("4242424242424242");

  await page
    .frameLocator("#card-expiry iframe")
    .locator('input[name="exp-date"]')
    .fill("01/50");

  await page
    .frameLocator("#cvc iframe")
    .locator('input[name="cvc"]')
    .fill("123");
};
