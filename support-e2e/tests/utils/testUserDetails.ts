import { Page } from '@playwright/test';

export const setTestUserDetails = async (
	page: Page,
	firstName: string,
	lastName: string,
	email: string,
) => {
	await page.getByLabel('Email address').fill(email);
	await page.getByLabel('First name').fill(firstName);
	await page.getByLabel('Last name').fill(lastName);
};
