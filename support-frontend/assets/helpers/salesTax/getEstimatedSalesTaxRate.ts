import type { CaState } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type {
	WindowProductCatalog,
	WindowTaxRates,
} from 'helpers/globalsAndSwitches/window';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';

type TaxRateResult =
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

export function getEstimatedSalesTaxRate(
	productCatalog: WindowProductCatalog,
	taxRates: WindowTaxRates,
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	maybeProvinceCode: CaState | undefined,
	supportRegionId: SupportRegionId,
): TaxRateResult {
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
