import type { Settings, Status } from 'helpers/globalsAndSwitches/settings';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import type { ConfiguredRegionAmounts } from '../contributions';

function isRecord(
	item: Record<string, unknown> | unknown,
): item is Record<string, unknown> {
	return item != null && !Array.isArray(item) && typeof item === 'object';
}

function getGlobal<T>(path = ''): T | null {
	const value = path
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

export const emptyConfiguredRegionAmounts: ConfiguredRegionAmounts = {
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
	const globalSettings = getGlobal<Settings>('settings');
	const defaultSettings = {
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
