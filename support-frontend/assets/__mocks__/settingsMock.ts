import type { AppConfig } from 'helpers/globalsAndSwitches/window';

const mockSettings = {
	switches: {
		oneOffPaymentMethods: {
			stripe: 'On',
			stripeApplePay: 'On',
			stripePaymentRequestButton: 'On',
			stripeExpressCheckout: 'On',
			payPal: 'On',
		},
		recurringPaymentMethods: {
			stripe: 'On',
			stripeApplePay: 'On',
			stripePaymentRequestButton: 'On',
			stripeExpressCheckout: 'On',
			payPal: 'On',
			directDebit: 'Off',
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
	},
	amounts: [
		{
			testName: 'FALLBACK_AMOUNTS__GBPCountries',
			liveTestName: '',
			isLive: false,
			targeting: {
				targetingType: 'Region',
				region: 'GBPCountries',
			},
			order: 0,
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 20,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
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
			targeting: {
				targetingType: 'Region',
				region: 'UnitedStates',
			},
			order: 0,
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
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
			targeting: {
				targetingType: 'Region',
				region: 'EURCountries',
			},
			order: 0,
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
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
			targeting: {
				targetingType: 'Region',
				region: 'International',
			},
			order: 0,
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
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
			targeting: {
				targetingType: 'Region',
				region: 'Canada',
			},
			order: 0,
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
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
			targeting: {
				targetingType: 'Region',
				region: 'AUDCountries',
			},
			order: 0,
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
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
			targeting: {
				targetingType: 'Region',
				region: 'NZDCountries',
			},
			order: 0,
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
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
	productsWithThankYouOnboarding: ['SupporterPlus'],
} as AppConfig['settings'];

window.guardian = { ...window.guardian, settings: mockSettings };
