import type { Settings } from 'helpers/globalsAndSwitches/settings';

export const mockSettings: Settings = {
	switches: {
		oneOffPaymentMethods: {
			stripe: 'On',
			stripeApplePay: 'On',
			stripePaymentRequestButton: 'On',
			payPal: 'On',
			amazonPay: 'On',
		},
		recurringPaymentMethods: {
			stripe: 'On',
			stripeApplePay: 'On',
			stripePaymentRequestButton: 'On',
			payPal: 'On',
			directDebit: 'Off',
			existingCard: 'On',
			existingDirectDebit: 'On',
			amazonPay: 'Off',
			sepa: 'On',
		},
		subscriptionsPaymentMethods: {
			directDebit: 'On',
			creditCard: 'On',
			paypal: 'On',
		},
		subscriptionsSwitches: {
			enableDigitalSubGifting: 'On',
			useDotcomContactPage: 'On',
			checkoutPostcodeLookup: 'Off',
		},
		featureSwitches: {
			enableQuantumMetric: 'On',
			usStripeAccountForSingle: 'On',
		},
		campaignSwitches: {
			enableContributionsCampaign: 'On',
			forceContributionsCampaign: 'Off',
		},
		recaptchaSwitches: {
			enableRecaptchaBackend: 'On',
			enableRecaptchaFrontend: 'On',
		},
		experiments: {},
	},
	amounts: [
		{
			testName: 'FALLBACK_AMOUNTS__GBPCountries',
			liveTestName: '',
			isLive: false,
			target: 'GBPCountries',
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [30, 60, 120, 240],
							defaultAmount: 60,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [3, 7, 12],
							defaultAmount: 7,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [60, 120, 240, 480],
							defaultAmount: 120,
							hideChooseYourAmount: false,
						},
					},
				},
			],
		},
		{
			testName: 'FALLBACK_AMOUNTS__UnitedStates',
			liveTestName: '',
			isLive: false,
			target: 'UnitedStates',
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [25, 50, 100, 250],
							defaultAmount: 50,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [7, 15, 30],
							defaultAmount: 15,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [50, 100, 250, 500],
							defaultAmount: 50,
							hideChooseYourAmount: false,
						},
					},
				},
			],
		},
		{
			testName: 'FALLBACK_AMOUNTS__EURCountries',
			liveTestName: '',
			isLive: false,
			target: 'EURCountries',
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [25, 50, 100, 250],
							defaultAmount: 50,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [6, 10, 20],
							defaultAmount: 10,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [50, 100, 250, 500],
							defaultAmount: 50,
							hideChooseYourAmount: false,
						},
					},
				},
			],
		},
		{
			testName: 'FALLBACK_AMOUNTS__International',
			liveTestName: '',
			isLive: false,
			target: 'International',
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [25, 50, 100, 250],
							defaultAmount: 50,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 20],
							defaultAmount: 10,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [60, 100, 250, 500],
							defaultAmount: 60,
							hideChooseYourAmount: false,
						},
					},
				},
			],
		},
		{
			testName: 'FALLBACK_AMOUNTS__Canada',
			liveTestName: '',
			isLive: false,
			target: 'Canada',
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [25, 50, 100, 250],
							defaultAmount: 50,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 20],
							defaultAmount: 10,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [60, 100, 250, 500],
							defaultAmount: 60,
							hideChooseYourAmount: false,
						},
					},
				},
			],
		},
		{
			testName: 'FALLBACK_AMOUNTS__AUDCountries',
			liveTestName: '',
			isLive: false,
			target: 'AUDCountries',
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [60, 100, 250, 500],
							defaultAmount: 100,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [10, 20, 40],
							defaultAmount: 20,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [80, 250, 500, 750],
							defaultAmount: 80,
							hideChooseYourAmount: false,
						},
					},
				},
			],
		},
		{
			testName: 'FALLBACK_AMOUNTS__NZDCountries',
			liveTestName: '',
			isLive: false,
			target: 'NZDCountries',
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [50, 100, 250, 500],
							defaultAmount: 100,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [10, 20, 50],
							defaultAmount: 20,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [50, 100, 250, 500],
							defaultAmount: 50,
							hideChooseYourAmount: false,
						},
					},
				},
			],
		},
	],
	contributionTypes: {
		GBPCountries: [
			{ contributionType: 'ONE_OFF' },
			{ contributionType: 'MONTHLY', isDefault: true },
			{ contributionType: 'ANNUAL' },
		],
		UnitedStates: [
			{ contributionType: 'ONE_OFF' },
			{ contributionType: 'MONTHLY', isDefault: true },
			{ contributionType: 'ANNUAL' },
		],
		EURCountries: [
			{ contributionType: 'ONE_OFF' },
			{ contributionType: 'MONTHLY', isDefault: true },
			{ contributionType: 'ANNUAL' },
		],
		International: [
			{ contributionType: 'ONE_OFF' },
			{ contributionType: 'MONTHLY', isDefault: true },
			{ contributionType: 'ANNUAL' },
		],
		Canada: [
			{ contributionType: 'ONE_OFF' },
			{ contributionType: 'MONTHLY', isDefault: true },
			{ contributionType: 'ANNUAL' },
		],
		AUDCountries: [
			{ contributionType: 'ONE_OFF' },
			{ contributionType: 'MONTHLY', isDefault: true },
			{ contributionType: 'ANNUAL' },
		],
		NZDCountries: [
			{ contributionType: 'ONE_OFF' },
			{ contributionType: 'MONTHLY', isDefault: true },
			{ contributionType: 'ANNUAL' },
		],
	},
	metricUrl:
		'https://metric-push-api-code.support.guardianapis.com/metric-push-api',
};

window.guardian = { ...window.guardian, settings: mockSettings };
