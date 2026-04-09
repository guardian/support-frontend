import type { Tests } from './models';

// ----- Tests ----- //
// Note: When setting up a test to run on the contributions thank you page
// you should always target both the landing page *and* the thank you page.
// This is to ensure the participation is picked up by ophan. The client side
// navigation from landing page to thank you page *won't* register any new
// participations.
// Note: These regexes are matched against the path and the querystring only (i.e. no domain)
export const pageUrlRegexes = {
	oneTimeCheckoutOnly: /(uk|us|au|ca|eu|nz|int)\/one-time-checkout/,
	landingPageSubscribeOnly: /uk\/subscribe/,
	landingPagePaperOnly: /uk\/subscribe\/paper/,
	genericCheckoutOnly: /(uk|us|au|ca|eu|nz|int)\/checkout/,
	paperPages:
		/(uk\/subscribe\/paper)|((uk\/(checkout|thank-you)).*?(SubscriptionCard|HomeDelivery|NationalDelivery))/,
	weeklyPages:
		/((uk|us|ca|eu|nz|int)\/subscribe\/weekly)|(((uk|us|ca|eu|nz|int)\/(checkout|thank-you)).*?(MonthlyPlus|QuarterlyPlus|AnnualPlus))/,
	weeklyGiftPages:
		/((uk|us|ca|eu|nz|int)\/subscribe\/weekly\/gift)|((uk|us|ca|eu|nz|int)(\/(checkout|thank-you))).*?(OneYearGift|ThreeMonthGift)/,
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
		excludeContributionsOnlyCountries: true,
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
		excludeContributionsOnlyCountries: true,
	},
	paypalMigrationRecurring: {
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
		isActive: false,
		referrerControlled: false, // ab-test name not needed to be in paramURL
		seed: 3,
		targetPage: pageUrlRegexes.genericCheckoutOnly,
		excludeContributionsOnlyCountries: true,
	},
};
