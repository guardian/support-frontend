import type { IsoCountry } from 'helpers/internationalisation/country';
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

const countriesAffectedByVATStatus: IsoCountry[] = [
	'RS',
	'EG',
	'PK',
	'MU',
	'BH',
	'MA',
	'MC',
	'OM',
	'GE',
	'NC',
	'TZ',
	'ZM',
	'AL',
	'BD',
	'KZ',
	'CW',
	'DO',
	'GP',
	'MQ',
	'PF',
	'TN',
	'BQ',
	'AX',
	'SN',
	'AM',
	'CM',
	'AO',
	'KG',
	'GA',
	'UZ',
	'MD',
	'DZ',
	'TJ',
	'LS',
	'CG',
	'TG',
	'NE',
];

export const tests: Tests = {
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
	makeItAnnualNudge: {
		variants: [
			{
				id: 'control',
			},
			{
				id: 'variant',
			},
		],
		isActive: false,
		audiences: {
			UnitedStates: {
				offset: 0,
				size: 1,
			},
		},
		referrerControlled: false,
		seed: 0,
		targetPage: pageUrlRegexes.contributions.allLandingPagesAndThankyouPages,
	},
	makeItAnnualNudgeGlobal: {
		variants: [
			{
				id: 'control',
			},
			{
				id: 'variant',
			},
		],
		isActive: true,
		audiences: {
			ALL: {
				offset: 0,
				size: 1,
			},
		},
		omitCountries: ['US', ...countriesAffectedByVATStatus],
		referrerControlled: false,
		seed: 0,
		targetPage: pageUrlRegexes.contributions.notUsLandingPage,
	},
};
