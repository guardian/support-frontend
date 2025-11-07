import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { defaultTestCard } from './creditCards';

const selectors = {
	cardNumber: 'input[name="cardNumber"]',
	cardExpiry: 'input[name="cardExpiry"]',
	cardCvc: 'input[name="cardCvc"]',
	billingName: 'input[name="billingName"]',
	billingCountry: 'select[name="billingCountry"]',
	billingPostalCode: 'input[name="billingPostalCode"]',
	submitButtonTestId: 'hosted-payment-submit-button',
};

export const expectToLandOnStripeCheckoutPage = async (stripePage: Page) => {
	await stripePage.waitForURL('https://checkout.stripe.com/**');
	await expect(stripePage.getByText('Enter payment details')).toBeVisible();
};

export const fillStripeCheckoutForm = async (stripePage: Page) => {
	await stripePage.locator(selectors.cardNumber).fill(defaultTestCard.number);
	await stripePage
		.locator(selectors.cardExpiry)
		.fill(defaultTestCard.expiryDate);
	await stripePage.locator(selectors.cardCvc).fill(defaultTestCard.cvc);
	await stripePage.locator(selectors.billingName).fill(defaultTestCard.name);
	await stripePage.locator(selectors.billingCountry).selectOption('GB');
	await stripePage.locator(selectors.billingPostalCode).fill('N1 9GU');
};

export const submitStripeCheckoutForm = async (stripePage: Page) => {
	await stripePage.getByTestId(selectors.submitButtonTestId).click();
};
