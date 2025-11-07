import type { Page } from '@playwright/test';

export const fillInCardDetails = (page: Page) =>
	fillInCardDetailsWithNumber(page, '4242424242424242');

export const fillInDeclinedCardDetails = (page: Page) =>
	fillInCardDetailsWithNumber(page, '4000000000000002');

const fillInCardDetailsWithNumber = async (page: Page, cardNumber: string) => {
	// it would be nice to use aria style selectors here, but given Stripes
	// very secure implementation, it is quite hard
	await page
		.frameLocator("iframe[title='Secure card number input frame']")
		.locator('input[name="cardnumber"]')
		.fill(cardNumber);

	await page
		.frameLocator("iframe[title='Secure expiration date input frame']")
		.locator('input[name="exp-date"]')
		.fill('01/50');

	await page
		.frameLocator("iframe[title='Secure CVC input frame']")
		.locator('input[name="cvc"]')
		.fill('123');
};
