import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { productCatalog } from 'helpers/productCatalog';
import { getBillingPeriodTitle } from 'helpers/productPrice/billingPeriods';

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
