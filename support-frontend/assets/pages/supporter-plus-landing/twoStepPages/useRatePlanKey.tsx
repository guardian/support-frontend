import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import { useMemo } from 'react';
import type { ContributionType } from 'helpers/contributions';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';

function getDigitalRatePlanKey(
	contributionType: ContributionType,
	supportRegionId: SupportRegionId,
	productKey: ProductKey,
) {
	const taxExclusionEnabled = supportRegionId === SupportRegionId.CA;
	switch (contributionType) {
		case 'ANNUAL':
			return taxExclusionEnabled && productKey !== 'Contribution'
				? 'AnnualTaxExclusive'
				: 'Annual';
		default:
			return taxExclusionEnabled && productKey !== 'Contribution'
				? 'MonthlyTaxExclusive'
				: 'Monthly';
	}
}

export function useDigitalRatePlanKey(
	contributionType: ContributionType,
	supportRegionId: SupportRegionId,
	productKey: ProductKey,
): ActiveRatePlanKey {
	return useMemo(() => {
		return getDigitalRatePlanKey(contributionType, supportRegionId, productKey);
	}, [contributionType, supportRegionId, productKey]);
}
