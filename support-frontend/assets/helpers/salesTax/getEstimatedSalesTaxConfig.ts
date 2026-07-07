import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { CaStateCode } from '@modules/internationalisation/state';
import { caStateCodes } from '@modules/internationalisation/state';
import type {
	WindowProductCatalog,
	WindowTaxRates,
} from 'helpers/globalsAndSwitches/window';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';

export type TaxRateConfig =
	| {
			type: 'tax_exclusive';
			rate: number;
	  }
	| {
			type: 'not_enough_information';
	  }
	| {
			type: 'tax_inclusive';
	  };

function isCaState(value: string): value is CaState {
	return caStateCodes.includes(value as CaState);
}

export function getEstimatedSalesTaxConfig(
	productCatalog: WindowProductCatalog,
	taxRates: WindowTaxRates,
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	maybeProvinceCode: string | undefined,
	supportRegionId: SupportRegionId,
): TaxRateConfig {
	if (supportRegionId !== SupportRegionId.CA) {
		return { type: 'tax_inclusive' };
	}

	if (
		productCatalog[productKey]?.ratePlans[ratePlanKey]?.taxMode !==
		'TaxExclusive'
	) {
		return {
			type: 'tax_inclusive',
		};
	}

	if (productKey !== 'DigitalSubscription' && productKey !== 'SupporterPlus') {
		return {
			type: 'tax_inclusive',
		};
	}

	if (!maybeProvinceCode) {
		return {
			type: 'not_enough_information',
		};
	}

	if (!isCaState(maybeProvinceCode)) {
		throw new Error(
			`Province code was an unexpected value: ${maybeProvinceCode}`,
		);
	}

	if (!taxRates) {
		throw new Error('Missing tax rate data');
	}

	const maybeProductTaxRates = taxRates[productKey];
	if (!maybeProductTaxRates) {
		throw new Error('Missing tax rate data for product');
	}

	return {
		type: 'tax_exclusive',
		rate: maybeProductTaxRates[maybeProvinceCode],
	};
}
