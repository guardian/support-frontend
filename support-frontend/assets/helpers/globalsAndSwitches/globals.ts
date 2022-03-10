import type { Settings } from 'helpers/globalsAndSwitches/settings';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import 'helpers/globalsAndSwitches/settings';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import type { Option } from 'helpers/types/option';
import type { ConfiguredRegionAmounts } from '../contributions';

function getGlobal<T>(path = ''): Option<T> {
	const value = path
		.replace(/\[(.+?)\]/g, '.$1')
		.split('.')
		// @ts-expect-error -- see comment on next line
		// eslint-disable-next-line -- TODO: safely typing this magic path traversal is a headache!!
		.reduce((o, key: any) => o && o[key], window.guardian);

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- TODO: fix when path traversal above is
	if (value) {
		return value as any as T;
	}

	return null;
}

const emptyConfiguredRegionAmounts: ConfiguredRegionAmounts = {
	control: {
		ONE_OFF: {
			amounts: [],
			defaultAmount: 0,
		},
		MONTHLY: {
			amounts: [],
			defaultAmount: 0,
		},
		ANNUAL: {
			amounts: [],
			defaultAmount: 0,
		},
	},
};

const getSettings = (): Settings => {
	const globalSettings: Settings | null = getGlobal('settings');
	return (
		globalSettings ?? {
			switches: {
				experiments: {},
			},
			amounts: {
				GBPCountries: emptyConfiguredRegionAmounts,
				UnitedStates: emptyConfiguredRegionAmounts,
				EURCountries: emptyConfiguredRegionAmounts,
				AUDCountries: emptyConfiguredRegionAmounts,
				International: emptyConfiguredRegionAmounts,
				NZDCountries: emptyConfiguredRegionAmounts,
				Canada: emptyConfiguredRegionAmounts,
			},
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
		}
	);
};

const getProductPrices = (): ProductPrices | null | undefined =>
	getGlobal('productPrices');

const getPromotionCopy = (): PromotionCopy | null | undefined =>
	getGlobal('promotionCopy');

const isSwitchOn = (switchName: string): boolean => {
	const sw = getGlobal(`settings.switches.${switchName}`);
	return !!(sw && sw === 'On');
};

export {
	getProductPrices,
	getPromotionCopy,
	getGlobal,
	getSettings,
	isSwitchOn,
};
