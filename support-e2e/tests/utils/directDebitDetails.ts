import { Page } from '@playwright/test';

export const fillInDirectDebitDetails = async (
	page: Page,
	pageType: 'subscription' | 'contribution',
) => {
	await page
		.getByLabel(
			pageType === 'subscription' ? 'Bank account holder name' : 'Account name',
		)
		.fill('CP Scott');
	await page.getByLabel('Sort code').fill('200000');
	await page.getByLabel('Account number').fill('55779911');

	await page
		.getByRole('checkbox', {
			name:
				'I confirm that I am the account holder and I am solely able to\n' +
				'\t\t\t\t\t\t\tauthorise debit from the account',
		})
		.check();
};
