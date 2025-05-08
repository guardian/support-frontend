import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { productCatalog } from 'helpers/productCatalog';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import {
	Annual,
	billingPeriodTitle,
} from 'helpers/productPrice/billingPeriods';

export function getLowerProductBenefitThreshold(
	billingPeriod: BillingPeriod,
	currencyId: IsoCurrency,
	countryGroupId: CountryGroupId,
	product: ActiveProductKey,
): number {
	const ratePlanTier3 =
		countryGroupId === 'International'
			? billingPeriod === Annual
				? 'RestOfWorldAnnual'
				: 'RestOfWorldMonthly'
			: billingPeriod === Annual
			? 'DomesticAnnual'
			: 'DomesticMonthly';
	const ratePlanRegularContribution = billingPeriodTitle(billingPeriod);
	const ratePlan =
		product === 'TierThree' ? ratePlanTier3 : ratePlanRegularContribution;
	return productCatalog[product]?.ratePlans[ratePlan]?.pricing[currencyId] ?? 0;
}
