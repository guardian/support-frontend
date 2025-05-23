import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { productCatalog } from 'helpers/productCatalog';
import {
	BillingPeriod,
	getBillingPeriodTitle,
} from 'helpers/productPrice/billingPeriods';

export function getLowerProductBenefitThreshold(
	billingPeriod: BillingPeriod,
	currencyId: IsoCurrency,
	countryGroupId: CountryGroupId,
	product: ActiveProductKey,
): number {
	const ratePlanTier3 =
		countryGroupId === 'International'
			? billingPeriod === BillingPeriod.Annual
				? 'RestOfWorldAnnual'
				: 'RestOfWorldMonthly'
			: billingPeriod === BillingPeriod.Annual
			? 'DomesticAnnual'
			: 'DomesticMonthly';
	const ratePlanRegularContribution = getBillingPeriodTitle(billingPeriod);
	const ratePlan =
		product === 'TierThree' ? ratePlanTier3 : ratePlanRegularContribution;
	return productCatalog[product]?.ratePlans[ratePlan]?.pricing[currencyId] ?? 0;
}
