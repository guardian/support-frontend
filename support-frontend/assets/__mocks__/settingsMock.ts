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
	amounts: {
		GBPCountries: {
			control: {
				ONE_OFF: { amounts: [5, 10, 15, 45], defaultAmount: 10 },
				MONTHLY: { amounts: [5, 10, 15, 20], defaultAmount: 20 },
				ANNUAL: { amounts: [5, 10, 15, 20], defaultAmount: 15 },
			},
			test: {
				name: 'GBP_COUNTRIES_AMOUNTS_TEST',
				isLive: true,
				variants: [
					{
						name: 'V1',
						amounts: {
							ONE_OFF: { amounts: [5, 10, 20, 25, 30], defaultAmount: 20 },
							MONTHLY: { amounts: [5, 15, 30, 40, 80], defaultAmount: 15 },
							ANNUAL: { amounts: [100, 150, 250, 500], defaultAmount: 250 },
						},
					},
					{
						name: 'V2',
						amounts: {
							ONE_OFF: { amounts: [10, 50, 100, 150], defaultAmount: 100 },
							MONTHLY: { amounts: [10, 20, 40, 50], defaultAmount: 50 },
							ANNUAL: { amounts: [150, 300, 500, 750], defaultAmount: 500 },
						},
					},
				],
				seed: 398375,
			},
		},
		UnitedStates: {
			control: {
				ONE_OFF: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
				MONTHLY: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
				ANNUAL: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
			},
		},
		EURCountries: {
			control: {
				ONE_OFF: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
				MONTHLY: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
				ANNUAL: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
			},
		},
		AUDCountries: {
			control: {
				ONE_OFF: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
				MONTHLY: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
				ANNUAL: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
			},
		},
		International: {
			control: {
				ONE_OFF: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
				MONTHLY: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
				ANNUAL: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
			},
		},
		NZDCountries: {
			control: {
				ONE_OFF: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
				MONTHLY: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
				ANNUAL: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
			},
		},
		Canada: {
			control: {
				ONE_OFF: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
				MONTHLY: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
				ANNUAL: { amounts: [5, 10, 15, 20], defaultAmount: 5 },
			},
		},
	},
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
