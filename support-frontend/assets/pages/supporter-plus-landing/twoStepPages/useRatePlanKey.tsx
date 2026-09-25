import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useEffect, useState } from 'react';
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
	const [ratePlanKey, setRatePlanKey] = useState<ActiveRatePlanKey>(
		getRatePlanKey(contributionType),
	);
	const isCanada = supportRegionId === SupportRegionId.CA;
	const taxExclusionEnabled = isCanada;

	useEffect(() => {
		setRatePlanKey(getRatePlanKey(contributionType));
	}, [contributionType]);

	if (taxExclusionEnabled) {
		return {
			ratePlanKey:
				ratePlanKey === 'Monthly'
					? 'MonthlyTaxExclusive'
					: 'AnnualTaxExclusive',
			taxExclusionEnabled,
		};
	}
	return { ratePlanKey, taxExclusionEnabled };
}
