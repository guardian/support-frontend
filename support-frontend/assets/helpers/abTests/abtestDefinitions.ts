import type { Tests } from './models';

// ----- Tests ----- //
// Note: When setting up a test to run on the contributions thank you page
// you should always target both the landing page *and* the thank you page.
// This is to ensure the participation is picked up by ophan. The client side
// navigation from landing page to thank you page *won't* register any new
// participations.
// Note: These regexes are matched against the path and the querystring only (i.e. no domain)
export const pageUrlRegexes = {
	allLandingAndThankyouPages:
		/^(?!(?:\/subscribe\/(paper|weekly)\/checkout$))(?:\/(uk|us|ca|eu|nz|int))?\/(checkout|one-time-checkout|contribute|thankyou|thank-you)(\/.*)?$/,
	contributions: {
		oneTimeCheckoutOnly: /(uk|us|au|ca|eu|nz|int)\/one-time-checkout.*?/,
	},
	subscriptions: {
		genericCheckoutOnly: /(uk|us|au|ca|eu|nz|int)\/checkout.*?/,
		subscribeLandingPageOnly: /\/uk\/subscribe$/,
		paper: {
			// Requires /subscribe/paper, allows /checkout or /checkout/guest, allows any query string
			paperLandingWithGuestCheckout:
				/\/subscribe\/paper(\/delivery|\/checkout|\/checkout\/guest)?(\?.*)?$/,
			paperLandingPage: /^\/uk\/subscribe\/paper?(\?.*)?$/,
		},
		weekly: {
			// Includes landing, original & generic checkout/thankyou pages
			weeklyGiftPages:
				/\/subscribe\/weekly\/gift.*?|\/subscribe\/weekly\/checkout\/gift.*?|((?:\/(uk|us|ca|eu|nz|int))(?:\/(checkout|thank-you))).*?(OneYearGift|ThreeMonthGift).*?/,
			// Uk weekly pages, including landing, original & generic checkout/thankyou pages
			weeklyUKPages:
				/(uk\/subscribe\/weekly).*?|(?:uk\/(checkout|thank-you)).*?(MonthlyPlus|QuarterlyPlus|AnnualPlus).*?/,
		},
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
		targetPage: pageUrlRegexes.allLandingAndThankyouPages,
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
		targetPage: pageUrlRegexes.allLandingAndThankyouPages,
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
		targetPage: pageUrlRegexes.subscriptions.genericCheckoutOnly,
		excludeContributionsOnlyCountries: true,
	},
	guardianWeeklySubscriptionSubtitle2: {
		variants: [
			{
				id: 'control',
			},
			{
				id: 'variant',
			},
		],
		audiences: {
			GBPCountries: {
				offset: 0,
				size: 1,
			},
		},
		isActive: true,
		referrerControlled: false, // ab-test name not needed to be in paramURL
		seed: 5,
		targetPage: pageUrlRegexes.subscriptions.subscribeLandingPageOnly,
		persistPage: pageUrlRegexes.subscriptions.weekly.weeklyUKPages,
		excludeContributionsOnlyCountries: true,
	},
};
