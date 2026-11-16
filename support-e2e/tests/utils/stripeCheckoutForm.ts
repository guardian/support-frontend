import type { FrameLocator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { defaultTestCard } from './creditCards';

const selectors = {
	stripeFormFrame: 'iframe[title="Secure embedded form frame"]',
	cardNumber: 'input[name="number"]',
	cardExpiry: 'input[name="expiry"]',
	cardCvc: 'input[name="cvc"]',
	billingName: 'input[name="name"]',
	billingCountry: 'select[name="country"]',
	billingPostalCode: 'input[name="postalCode"]',
	submitButtonTestId: 'payment-form-submit-button',
};

const getStripeFormFrame = (stripePage: Page): FrameLocator =>
	stripePage.frameLocator(selectors.stripeFormFrame);

export const expectToLandOnStripeCheckoutPage = async (stripePage: Page) => {
	await stripePage.waitForURL('https://checkout.stripe.com/**');
	const stripeForm = getStripeFormFrame(stripePage);
	await expect(stripeForm.getByText('Payment method')).toBeVisible();
};

export const fillStripeCheckoutForm = async (stripePage: Page) => {
	const stripeForm = getStripeFormFrame(stripePage);
	await stripeForm.locator(selectors.cardNumber).fill(defaultTestCard.number);
	await stripeForm
		.locator(selectors.cardExpiry)
		.fill(defaultTestCard.expiryDate);
	await stripeForm.locator(selectors.cardCvc).fill(defaultTestCard.cvc);
	await stripeForm.locator(selectors.billingName).fill(defaultTestCard.name);
	await stripeForm.locator(selectors.billingCountry).selectOption('GB');
	await stripeForm.locator(selectors.billingPostalCode).fill('N1 9GU');
};

export const submitStripeCheckoutForm = async (stripePage: Page) => {
	const stripeForm = getStripeFormFrame(stripePage);
	await stripeForm.getByTestId(selectors.submitButtonTestId).click();
};
