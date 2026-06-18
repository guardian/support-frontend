import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useEffect, useState } from 'react';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import type { ContributionType } from 'helpers/contributions';
import { contributionTypeToBillingPeriod } from 'helpers/productPrice/billingPeriods';

const TAX_EXCLUSIVE_RATE_PLAN_SUFFIX = 'TaxExclusive';

export function useRatePlanKey(
	contributionType: ContributionType,
	supportRegionId: SupportRegionId,
) {
	const [ratePlanKey, setRatePlanKey] = useState<string>(
		contributionTypeToBillingPeriod(contributionType),
	);

	const { enableCanadaTaxExclusion } = useFeatureSwitches();
	const isCanada = supportRegionId === SupportRegionId.CA;
	const taxExclusionEnabled = isCanada && enableCanadaTaxExclusion;

	useEffect(() => {
		setRatePlanKey(contributionTypeToBillingPeriod(contributionType));
	}, [contributionType]);

	return taxExclusionEnabled
		? `${ratePlanKey}${TAX_EXCLUSIVE_RATE_PLAN_SUFFIX}`
		: ratePlanKey;
}
