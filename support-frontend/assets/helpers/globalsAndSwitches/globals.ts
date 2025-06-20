import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { Settings, Status } from 'helpers/globalsAndSwitches/settings';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import type { AmountsTest, AmountsVariant } from '../contributions';

function isRecord(item: unknown): item is Record<string, unknown> {
	return item != null && !Array.isArray(item) && typeof item === 'object';
}

function getGlobal<T>(path = ''): T | null {
	const value = path
		.replace(/^window.guardian./, '')
		.replace(/\[(.+?)\]/g, '.$1')
		.split('.')
		.reduce<unknown>((config: unknown, key: string) => {
			if (isRecord(config)) {
				return config[key];
			}
			return config;
		}, window.guardian);

	if (value) {
		return value as T;
	}

	return null;
}

const emptyAmountsTestVariants: AmountsVariant[] = [
	{
		variantName: 'CONTROL',
		defaultContributionType: 'MONTHLY',
		displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
		amountsCardData: {
			ONE_OFF: {
				amounts: [],
				defaultAmount: 0,
				hideChooseYourAmount: false,
			},
			MONTHLY: {
				amounts: [],
				defaultAmount: 0,
				hideChooseYourAmount: false,
			},
			ANNUAL: {
				amounts: [],
				defaultAmount: 0,
				hideChooseYourAmount: false,
			},
		},
	},
];

export const emptyConfiguredRegionAmounts: AmountsTest = {
	testName: '',
	liveTestName: '',
	isLive: false,
	targeting: {
		targetingType: 'Region',
		region: 'GBPCountries',
	},
	order: 0,
	seed: 0,
	variants: emptyAmountsTestVariants,
};

export const emptySwitches = {
	experiments: {},
	oneOffPaymentMethods: {},
	recurringPaymentMethods: {},
	subscriptionsPaymentMethods: {},
	subscriptionsSwitches: {},
	featureSwitches: {},
	campaignSwitches: {},
	recaptchaSwitches: {},
};

const getSettings = (): Settings => {
	const globalSettings = getGlobal<Settings>('settings');

	const defaultSettings = {
		switches: emptySwitches,
		amounts: [
			{
				...emptyConfiguredRegionAmounts,
				testName: 'EMPTY_TEST__GBPCountries',
				target: 'GBPCountries' as CountryGroupId,
			},
			{
				...emptyConfiguredRegionAmounts,
				testName: 'EMPTY_TEST__UnitedStates',
				target: 'UnitedStates' as CountryGroupId,
			},
			{
				...emptyConfiguredRegionAmounts,
				testName: 'EMPTY_TEST__Canada',
				target: 'Canada' as CountryGroupId,
			},
			{
				...emptyConfiguredRegionAmounts,
				testName: 'EMPTY_TEST__NZDCountries',
				target: 'NZDCountries' as CountryGroupId,
			},
			{
				...emptyConfiguredRegionAmounts,
				testName: 'EMPTY_TEST__EURCountries',
				target: 'EURCountries' as CountryGroupId,
			},
			{
				...emptyConfiguredRegionAmounts,
				testName: 'EMPTY_TEST__International',
				target: 'International' as CountryGroupId,
			},
			{
				...emptyConfiguredRegionAmounts,
				testName: 'EMPTY_TEST__AUDCountries',
				target: 'AUDCountries' as CountryGroupId,
			},
		],
		contributionTypes: {
			GBPCountries: [],
			UnitedStates: [],
			EURCountries: [],
			AUDCountries: [],
			International: [],
			NZDCountries: [],
			Canada: [],
		},
		metricUrl: '',
	};
	return globalSettings ?? defaultSettings;
};

const getProductPrices = (): ProductPrices | null =>
	getGlobal<ProductPrices>('productPrices');

const getPromotionCopy = (): PromotionCopy | null =>
	getGlobal<PromotionCopy>('promotionCopy');

const isSwitchOn = (switchName: string): boolean => {
	const sw = getGlobal<Status>(`settings.switches.${switchName}`);
	return !!(sw && sw === 'On');
};

export {
	getProductPrices,
	getPromotionCopy,
	getGlobal,
	getSettings,
	isSwitchOn,
};
