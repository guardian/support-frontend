import {expect, Page} from "@playwright/test";

export const checkRecaptcha = async (
  page:Page,
) => {
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

};
