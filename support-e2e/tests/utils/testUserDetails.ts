import { Page } from "@playwright/test";
import {email, firstName, lastName} from "./users";

export const setTestUserDetails = async (
  page:Page,
) => {
  await page.getByLabel("Email address").type(email);
  await page.getByLabel("First name").type(firstName);
  await page.getByLabel("Last name").type(lastName);
};
