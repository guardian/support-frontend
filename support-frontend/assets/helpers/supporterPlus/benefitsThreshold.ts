import type { ContributionType } from 'helpers/contributions';
import type { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { productCatalog } from 'helpers/productCatalog';

export function getLowerProductBenefitThreshold(
	contributionType: ContributionType,
	currencyId: IsoCurrency,
	countryGroupId: CountryGroup,
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
	const ratePlanSupporterPlus =
		contributionType === 'ANNUAL' ? 'Annual' : 'Monthly';
	return (
		productCatalog[product]?.ratePlans[
			product === 'SupporterPlus' ? ratePlanSupporterPlus : ratePlanTier3
		]?.pricing[currencyId] ?? 0
	);
}
