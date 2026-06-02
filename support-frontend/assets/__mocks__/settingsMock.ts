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
