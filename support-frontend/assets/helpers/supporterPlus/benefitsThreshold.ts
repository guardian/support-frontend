import {
	config,
	type RegularContributionTypeQuarterly,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { productCatalog } from 'helpers/productCatalog';

function capitalise(any: string): string {
	return any.charAt(0).toUpperCase() + any.slice(1);
}

export function getLowerProductBenefitThreshold(
	contributionType: RegularContributionTypeQuarterly,
	currencyId: IsoCurrency,
	countryGroupId: CountryGroupId,
	product: ActiveProductKey,
): number {
	const ratePlanTier3 =
		countryGroupId === 'International'
			? contributionType === 'ANNUAL'
				? 'RestOfWorldAnnual'
				: 'RestOfWorldMonthly'
			: contributionType === 'ANNUAL'
			? 'DomesticAnnual'
			: 'DomesticMonthly';
	const ratePlanRegularContribution = capitalise(
		config[countryGroupId][contributionType].frequencyPlural,
	);
	const ratePlan =
		product === 'TierThree' ? ratePlanTier3 : ratePlanRegularContribution;
	return productCatalog[product]?.ratePlans[ratePlan]?.pricing[currencyId] ?? 0;
}
