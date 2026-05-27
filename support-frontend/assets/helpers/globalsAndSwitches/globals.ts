import { storage } from '@guardian/libs';
import type { Settings, Status } from 'helpers/globalsAndSwitches/settings';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';

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

function getLocal<T>(path = ''): T | null {
	// feature flags path is in the format 'featureSwitches.featureFlagName' and we want to
	// extract the 'featureFlagName' part to check if there is an override in sessionStorage

	if (!storage.session.isAvailable()) {
		return null;
	}

	const [flag] = path.split('.').slice(-1);

	try {
		const value = flag && storage.session.get(flag);
		if (value) {
			return value as T;
		}

		return null;
	} catch (e) {
		console.error(
			`Failed to read overrides for flag "${flag}" from path "${path}":`,
			e,
		);
		return null;
	}
}

export const emptySwitches = {
	experiments: {},
	oneOffPaymentMethods: {},
	recurringPaymentMethods: {},
	subscriptionsSwitches: {},
	featureSwitches: {},
	campaignSwitches: {},
	recaptchaSwitches: {},
};

const getSettings = (): Settings => {
	const globalSettings = getGlobal<Settings>('settings');

	const defaultSettings = {
		switches: emptySwitches,
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
	const localOverride = switchName.startsWith('featureSwitches.')
		? getLocal<Status>(switchName)
		: null;

	const sw =
		localOverride ?? getGlobal<Status>(`settings.switches.${switchName}`);

	return sw === 'On';
};

export {
	getProductPrices,
	getPromotionCopy,
	getGlobal,
	getSettings,
	isSwitchOn,
};
