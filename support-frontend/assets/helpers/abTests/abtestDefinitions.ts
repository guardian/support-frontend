import { countriesAffectedByVATStatus } from 'helpers/internationalisation/country';
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
	},
	threeTierCheckoutV3: {
		variants: [
			{
				id: 'variantFixed',
			},
			{
				id: 'variantVariable',
			},
		],
		isActive: true,
		audiences: {
			ALL: {
				offset: 0,
				size: 1,
			},
		},
		omitCountries: countriesAffectedByVATStatus,
		referrerControlled: false,
		excludeIfInReferrerControlledTest: true,
		seed: 0,

		/**
		 * This runs on
		 * - /{countryGroupId}/contribute
		 * - /{countryGroupId}/contribute/checkout
		 * - /{countryGroupId}/thankyou
		 * - /subscribe/weekly/checkout?threeTierCreateSupporterPlusSubscription=true
		 *
		 * And does not run on
		 * - /subscribe/weekly/checkout
		 */
		canRun: () => {
			// Contribute pages
			const isContributionLandingPageOrThankyou =
				window.location.pathname.match(
					pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
				) !== null;

			// Weekly pages
			const urlParams = new URLSearchParams(window.location.search);
			const isThirdTier =
				urlParams.get('threeTierCreateSupporterPlusSubscription') === 'true';
			const isWeeklyCheckout =
				window.location.pathname === '/subscribe/weekly/checkout';

			return (
				isContributionLandingPageOrThankyou || (isWeeklyCheckout && isThirdTier)
			);
		},
	},
};
