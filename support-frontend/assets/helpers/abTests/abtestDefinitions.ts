import type { Tests } from './models';
// ----- Tests ----- //
// Note: When setting up a test to run on the contributions thank you page
// you should always target both the landing page *and* the thank you page.
// This is to ensure the participation is picked up by ophan. The client side
// navigation from landing page to thank you page *won't* register any new
// participations.
export const pageUrlRegexes = {
	contributions: {
		/*
        We can revert to a simpler regex like below when subscription checkouts are deleted
        /contribute|checkout|one-time-checkout|thankyou(/.*)?$
      */
		allLandingPagesAndThankyouPages:
			'^(?!(?:/subscribe/(paper|weekly)/checkout$))(?:/(uk|us|ca|eu|nz|int))?/(checkout|one-time-checkout|contribute|thankyou|thank-you)(/.*)?$',
		usLandingPageOnly: '/us/contribute$',
		genericCheckoutOnly:
			'(uk|us|au|ca|eu|nz|int)/checkout|thank-you\\?product(.*)?$',
		oneTimeCheckoutOnly:
			'(uk|us|au|ca|eu|nz|int)/one-time-checkout|thank-you\\?contribution(.*)?$',
	},
	subscriptions: {
		paper: {
			// Requires /subscribe/paper, allows /checkout or /checkout/guest, allows any query string
			paperLandingWithGuestCheckout:
				/\/subscribe\/paper(\/delivery|\/checkout|\/checkout\/guest)?(\?.*)?$/,
			paperLandingPage: /^\/uk\/subscribe\/paper?(\?.*)?$/,
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
		targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
		excludeContributionsOnlyCountries: true,
	},
	newspaperArchiveBenefit: {
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
		excludeContributionsOnlyCountries: true,
	},
	newspaperGenericCheckout: {
		variants: [
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
		seed: 9,
		targetPage:
			pageUrlRegexes.subscriptions.paper.paperLandingWithGuestCheckout,
		persistPage:
			// match generic checkout & thank you page
			'^/uk/(checkout|thank-you)',
		excludeContributionsOnlyCountries: true,
	},
};
