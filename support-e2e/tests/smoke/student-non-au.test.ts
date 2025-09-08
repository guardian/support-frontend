import { expect, test } from '@playwright/test';
import { email, firstName, lastName } from '../utils/users';
import { checkRecaptcha } from '../utils/recaptcha';
import { fillInCardDetails } from '../utils/cardDetails';
import { setupPage } from '../utils/page';
import { setTestUserCoreDetails } from '../utils/testUserDetails';
import { fillInDirectDebitDetails } from '../utils/directDebitDetails';

[
	{
		country: 'uk',
		state: undefined,
		paymentMethod: 'DirectDebit',
		amountDescription: '£9',
		expectedCardHeading: 'All-access digital',
		expectedCheckoutText:
			'If you cancel within the first 14 days, you will receive a full refund.',
		accessibleCtaText: 'Subscribe',
	},
	{
		country: 'us',
		state: 'California',
		stateLabel: 'State',
		paymentMethod: 'Card',
		amountDescription: '$10',
		expectedCardHeading: 'All-access digital',
		expectedCheckoutText:
			'If you cancel within the first 14 days, you will receive a full refund.',
		accessibleCtaText: 'Subscribe',
	},
	{
		country: 'ca',
		state: 'Ontario',
		stateLabel: 'Province',
		paymentMethod: 'Card',
		amountDescription: '$10',
		expectedCardHeading: 'All-access digital',
		expectedCheckoutText:
			'If you cancel within the first 14 days, you will receive a full refund.',
		accessibleCtaText: 'Subscribe',
	},
].forEach((testDetails) => {
	test(`${testDetails.expectedCardHeading} ${testDetails.country}`, async ({
		context,
		baseURL,
	}) => {
		// Landing
		const page = await context.newPage();

		await setupPage(page, context, baseURL, `/${testDetails.country}/student`);

		const cardHeading = page.getByRole('heading', {
			name: testDetails.expectedCardHeading,
		});
		const card = page.locator('section').filter({ has: cardHeading });
		await expect(
			card.getByText(`${testDetails.amountDescription}/year`).first(),
		).toBeVisible();

		// Click through to the checkout
		const purchaseButton = await page.getByText(testDetails.accessibleCtaText);
		await purchaseButton.click();

		// Checkout
		const testFirstName = firstName();
		const testLastName = lastName();
		const testEmail = email();
		await expect(
			page.getByText(testDetails.expectedCheckoutText).first(),
		).toBeVisible();
		await setTestUserCoreDetails(
			page,
			testEmail,
			testFirstName,
			testLastName,
			true,
		);
		if (testDetails.state !== undefined) {
			await page
				.getByLabel(testDetails.stateLabel)
				.selectOption({ label: testDetails.state });
		}

		if (testDetails.paymentMethod === 'DirectDebit') {
			await page.getByRole('radio', { name: 'Direct Debit' }).check();
			await fillInDirectDebitDetails(page);
		} else {
			await page.getByRole('radio', { name: 'Credit/Debit card' }).check();
			await fillInCardDetails(page);
		}

		await checkRecaptcha(page);
		await page
			.getByRole('button', {
				name: `Pay`,
			})
			.click();

		// Thank you
		await expect(page.getByRole('heading', { name: 'Thank you' })).toBeVisible({
			timeout: 600000,
		});

		const thankYouText = `Thank you for supporting us with ${testDetails.amountDescription}`;

		await expect(page.getByText(thankYouText).first()).toBeVisible({
			timeout: 600000,
		});
	});
});
