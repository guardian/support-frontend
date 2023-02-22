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
		subsDigiSubPages: '(/??/subscribe(\\?.*)?$|/??/subscribe/digital(\\?.*)?$)',
		digiSubLandingPages:
			'(/??/subscribe/digital/gift(\\?.*)?$|/??/subscribe/digital(\\?.*)?$)',
		digiSubLandingPagesNotAus:
			'(/(uk|us|ca|eu|nz|int)/subscribe/digital(\\?.*)?$)',
		digiSub: {
			// Requires /subscribe/digital, allows /checkout and/or /gift, allows any query string
			allLandingAndCheckout:
				/\/subscribe\/digital(\/checkout)?(\/gift)?(\?.*)?$/,
			// Requires /subscribe/digital and /gift, allows /checkout before /gift, allows any query string
			giftLandingAndCheckout: /\/subscribe\/digital(\/checkout)?\/gift(\?.*)?$/,
			// Requires /subscribe/digital, allows /checkout, allows any query string
			nonGiftLandingAndCheckoutWithGuest:
				/\/subscribe\/digital(\/checkout|\/checkout\/guest)?(\?.*)?$/,
			nonGiftLandingNotAusNotUS:
				/((uk|ca|eu|nz|int)\/subscribe\/digital(?!\/gift).?(\\?.*)?$)|(\/subscribe\/digital\/checkout?(\\?.*)?$)/,
		},
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
	singleToRecurringV3: {
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
				breakpoint: {
					minWidth: 'tablet',
				},
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
	supporterPlusV2: {
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
				size: 0, //opt-in only at this stage
			},
		},
		isActive: true,
		referrerControlled: false,
		targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
		seed: 1,
	},
};
