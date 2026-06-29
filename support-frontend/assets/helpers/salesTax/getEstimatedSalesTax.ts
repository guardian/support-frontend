import type { CaState } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';

type TaxRateResult =
	| {
			type: 'rate';
			rate: number;
	  }
	| {
			type: 'not_enough_information';
	  }
	| {
			type: 'not_applicable';
	  }
	| {
			type: 'error';
			message: string;
	  };

export function getEstimatedSalesTaxRate(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	appConfig: AppConfig,
	maybeProvinceCode: CaState | undefined,
	supportRegionId: SupportRegionId,
): TaxRateResult {
	const { productCatalog, taxRates } = appConfig;

	if (supportRegionId !== SupportRegionId.CA) {
		return { type: 'not_applicable' };
	}

	if (
		productCatalog[productKey]?.ratePlans[ratePlanKey]?.taxMode !==
		'TaxExclusive'
	) {
		return {
			type: 'not_applicable',
		};
	}

	if (productKey !== 'DigitalSubscription' && productKey !== 'SupporterPlus') {
		return {
			type: 'not_applicable',
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

	const maybeRate = maybeProductTaxRates[maybeProvinceCode] as
		| number
		| undefined;
	if (maybeRate === undefined) {
		throw new Error('Missing tax rate date for province');
	}

	return {
		type: 'rate',
		rate: maybeRate,
	};
}
