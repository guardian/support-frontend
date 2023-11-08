import { Page } from "@playwright/test";

export const setTestUserDetails = async (
  page:Page,
  firstName: string,
  lastName: string,
  email: string,
) => {
  await page.getByLabel("Email address").type(email);
  await page.getByLabel("First name").type(firstName);
  await page.getByLabel("Last name").type(lastName);
};
