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
		genericCheckoutOnly: '(uk|us|au|ca|eu|nz|int)/checkout|thank-you(/.*)?$',
	},
	subscriptions: {
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
	confirmEmail: {
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
		targetPage: pageUrlRegexes.contributions.genericCheckoutOnly,
		excludeContributionsOnlyCountries: false,
	},
	digitalEditionCheckout: {
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
		isActive: false,
		referrerControlled: false, // ab-test name not needed to be in paramURL
		seed: 7,
		targetPage:
			'(/uk/)(subscribe$|subscribe/digitaledition$|subscribe/digitaledition/thankyou$|checkout|thank-you)', // one-off test using canRun to exclude all products except DigitalSubscription
		excludeContributionsOnlyCountries: true,
		canRun: () => {
			const urlSearchParams = new URLSearchParams(window.location.search);
			const productParam = urlSearchParams.get('product');
			return !productParam || productParam === 'DigitalSubscription';
		},
	},
	subscribeCheckoutImage: {
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
		targetPage:
			'(/subscribe/weekly/checkout$|/subscribe/weekly/checkout/gift$)', // weekly only test
		excludeContributionsOnlyCountries: true,
	},
};
