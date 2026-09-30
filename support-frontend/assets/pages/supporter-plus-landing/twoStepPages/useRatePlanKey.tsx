import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useMemo } from 'react';
import type { ContributionType } from 'helpers/contributions';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';

export function getRatePlanKey(contributionType: ContributionType) {
	switch (contributionType) {
		case 'ANNUAL':
			return 'Annual';
		default:
			return 'Monthly';
	}
}

export function useRatePlanKey(
	contributionType: ContributionType,
	supportRegionId: SupportRegionId,
): { ratePlanKey: ActiveRatePlanKey; taxExclusionEnabled: boolean } {
	const taxExclusionEnabled = supportRegionId === SupportRegionId.CA;
	return useMemo(() => {
		const base = getRatePlanKey(contributionType);
		if (!taxExclusionEnabled) {
			return { ratePlanKey: base, taxExclusionEnabled };
		}
		return {
			ratePlanKey:
				base === 'Monthly' ? 'MonthlyTaxExclusive' : 'AnnualTaxExclusive',
			taxExclusionEnabled,
		};
	}, [contributionType, taxExclusionEnabled]);
}
