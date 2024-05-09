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
		notUsLandingPage: '/uk|au|eu|int|nz|ca/contribute(/.*)?$',
		auLandingPage: '/au/contribute(/.*)?$',
		usLandingPage: '/us/contribute(/.*)?$',
		allLandingPagesExecptSupportPlus:
			'\bcontribute\b(?!.*acquisitionData.*abTest.*supporterPlusOnly.*variant.*variant)',
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
	supporterPlusOnly: {
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
				size: 0,
			},
		},
		isActive: true,
		referrerControlled: true,
		seed: 2,
		targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
		excludeCountriesSubjectToContributionsOnlyAmounts: true,
	},
	usFreeBookOffer: {
		variants: [
			{
				id: 'control',
			},
		],
		audiences: {
			US: {
				offset: 0,
				size: 1,
			},
		},
		isActive: false,
		referrerControlled: false, // ab-test name not needed to be in paramURL
		seed: 3,
		targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
		excludeCountriesSubjectToContributionsOnlyAmounts: true,
	},
	useGenericCheckout: {
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
		seed: 5,
		targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
		excludeCountriesSubjectToContributionsOnlyAmounts: true,
	},
	tierCardCtaCopy: {
		variants: [
			{
				id: 'control',
			},
			{
				id: 'v1',
			},
			{
				id: 'v2',
			},
			{
				id: 'v3',
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
		seed: 6,
		targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
		excludeCountriesSubjectToContributionsOnlyAmounts: true,
	},
};
