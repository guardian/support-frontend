import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { ProductRatePlanKey } from '@modules/product-catalog/productCatalog';
import type { ContributionType } from 'helpers/contributions';

export type TierProductKey =
	| 'Contribution'
	| 'SupporterPlus'
	| 'DigitalSubscription';
export function getDigitalRatePlanKey(
	contributionType: ContributionType,
	supportRegionId: SupportRegionId,
	productKey: TierProductKey,
): ProductRatePlanKey<TierProductKey> {
	const enableTaxExclusion =
		productKey !== 'Contribution' && supportRegionId === SupportRegionId.CA;
	switch (contributionType) {
		case 'ANNUAL':
			return enableTaxExclusion ? 'AnnualTaxExclusive' : 'Annual';
		default:
			return enableTaxExclusion ? 'MonthlyTaxExclusive' : 'Monthly';
	}
}
