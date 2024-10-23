import type { Tests } from './abtest';
// ----- Tests ----- //
// Note: When setting up a test to run on the contributions thank you page
// you should always target both the landing page *and* the thank you page.
// This is to ensure the participation is picked up by ophan. The client side
// navigation from landing page to thank you page *won't* register any new
// participations.
export const pageUrlRegexes = {
	contributions: {
		allLandingPagesAndThankyouPages:
			'/checkout|one-time-checkout|contribute|thankyou|thank-you(/.*)?$',
		usLandingPageOnly: '/us/contribute$',
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
				/\/subscribe\/paper(\/delivery|\/checkout|\/checkout\/guest)?(\?.*)?$/,
		},
		subsWeeklyPages:
			'(/??/subscribe(\\?.*)?$|/??/subscribe/weekly(\\/checkout)?(\\?.*)?$)',
	},
};

export const tests: Tests = {
	patronsOneOffOnly: {
		variants: [
			// not really an AB test
			{
				id: 'variant',
			},
		],
		audiences: {
			ALL: {
				offset: 0,
				size: 0,
			},
		},
		isActive: true,
		referrerControlled: true,
		seed: 1,
		targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
		excludeCountriesSubjectToContributionsOnlyAmounts: true,
	},
	abandonedBasket: {
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
		referrerControlled: false, // ab-test name not needed to be in paramURL
		seed: 1,
		targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
		excludeCountriesSubjectToContributionsOnlyAmounts: true,
	},
	newspaperArchiveBenefit: {
		variants: [
			{
				id: 'control',
			},
			{
				id: 'v1',
			},
			{ id: 'v2' },
		],
		audiences: {
			ALL: {
				offset: 0,
				size: 1,
			},
		},
		isActive: false,
		referrerControlled: false, // ab-test name not needed to be in paramURL
		seed: 2,
		targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
		excludeCountriesSubjectToContributionsOnlyAmounts: true,
	},
	auPartnerBenefit: {
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
		referrerControlled: false, // ab-test name not needed to be in paramURL
		seed: 8,
		targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
		excludeCountriesSubjectToContributionsOnlyAmounts: true,
	},
	coverTransactionCost: {
		variants: [
			{
				id: 'control',
			},
			{
				id: 'variantA',
			},
			{
				id: 'variantB',
			},
		],
		audiences: {
			ALL: {
				offset: 0,
				size: 1,
			},
		},
		isActive: true,
		referrerControlled: false, // ab-test name not needed to be in paramURL
		seed: 3,
		targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
		excludeCountriesSubjectToContributionsOnlyAmounts: true,
	},
	newOneTimeCheckout: {
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
		referrerControlled: false, // ab-test name not needed to be in paramURL
		seed: 4,
		targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
		excludeCountriesSubjectToContributionsOnlyAmounts: false,
	},
	linkExpressCheckout: {
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
		referrerControlled: false, // ab-test name not needed to be in paramURL
		seed: 5,
		targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
		excludeCountriesSubjectToContributionsOnlyAmounts: true,
	},
	landingPageOneTimeTab2: {
		variants: [
			{
				id: 'control',
			},
			{
				id: 'oneTimeTab',
			},
		],
		audiences: {
			UnitedStates: {
				offset: 0,
				size: 1,
			},
			GBPCountries: {
				offset: 0,
				size: 1,
			},
			EURCountries: {
				offset: 0,
				size: 1,
			},
			Canada: { offset: 0, size: 1 },
			NZDCountries: { offset: 0, size: 1 },
			International: { offset: 0, size: 1 },
		},
		isActive: true,
		referrerControlled: false,
		seed: 6,
		targetPage: pageUrlRegexes.contributions.usLandingPageOnly,
		// Track this landing page test through to the checkout
		persistPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
		excludeCountriesSubjectToContributionsOnlyAmounts: false,
	},
};
