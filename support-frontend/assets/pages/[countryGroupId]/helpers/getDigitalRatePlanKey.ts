import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import type { ContributionType } from 'helpers/contributions';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';

export function getDigitalRatePlanKey(
	contributionType: ContributionType,
	supportRegionId: SupportRegionId,
	productKey: ProductKey,
): ActiveRatePlanKey {
	const enableTaxExclusion =
		productKey !== 'Contribution' && supportRegionId === SupportRegionId.CA;
	switch (contributionType) {
		case 'ANNUAL':
			return enableTaxExclusion ? 'AnnualTaxExclusive' : 'Annual';
		default:
			return enableTaxExclusion ? 'MonthlyTaxExclusive' : 'Monthly';
	}
}
