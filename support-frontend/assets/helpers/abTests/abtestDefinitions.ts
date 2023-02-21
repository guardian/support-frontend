import type { Tests } from './abtest';
// ----- Tests ----- //
// Note: When setting up a test to run on the contributions thank you page
// you should always target both the landing page *and* the thank you page.
// This is to ensure the participation is picked up by ophan. The client side
// navigation from landing page to thank you page *won't* register any new
// participations.
export const pageUrlRegexes = {
	contributions: {
		allLandingPagesAndThankyouPages: '/contribute|thankyou(/.*)?$',
		notUkLandingPage: '/us|au|eu|int|nz|ca/contribute(/.*)?$',
		auLandingPage: '/au/contribute(/.*)?$',
	},
	subscriptions: {
		// Requires /subscribe, allows any query string
		subsLandingPage: '(/??/subscribe(\\?.*)?$)',
		paper: {
			// Requires /subscribe/paper, allows /checkout or /checkout/guest, allows any query string
			paperLandingWithGuestCheckout:
				/\/subscribe\/paper(\/checkout|\/checkout\/guest)?(\?.*)?$/,
		},
		subsWeeklyPages:
			'(/??/subscribe(\\?.*)?$|/??/subscribe/weekly(\\/checkout)?(\\?.*)?$)',
	},
};
export const tests: Tests = {
	singleToRecurringV2: {
		variants: [
			{
				id: 'control',
			},
			{
				id: 'variant',
			},
		],
		audiences: {
			ALL: {
				offset: 0,
				size: 1,
			},
		},
		isActive: true,
		referrerControlled: false,
		targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
		seed: 15,
	},
	guardianWeeklyPriceCards: {
		variants: [
			{
				id: 'control',
			},
			{
				id: 'variant',
			},
		],
		audiences: {
			ALL: {
				offset: 0,
				size: 1,
			},
		},
		isActive: false,
		referrerControlled: false,
		targetPage: pageUrlRegexes.subscriptions.subsWeeklyPages,
		seed: 11,
	},
};
