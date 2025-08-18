import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { productCatalog } from 'helpers/productCatalog';
import { getBillingPeriodTitle } from 'helpers/productPrice/billingPeriods';

export function getLowerProductBenefitThreshold(
	billingPeriod: BillingPeriod,
	currencyId: IsoCurrency,
	countryGroupId: CountryGroupId,
	product: ActiveProductKey,
	ratePlan: ActiveRatePlanKey,
): number {
	if (product === 'TierThree') {
		const ratePlanTier3 =
			countryGroupId === 'International'
				? billingPeriod === BillingPeriod.Annual
					? 'RestOfWorldAnnual'
					: 'RestOfWorldMonthly'
				: billingPeriod === BillingPeriod.Annual
				? 'DomesticAnnual'
				: 'DomesticMonthly';

		return (
			productCatalog[product]?.ratePlans[ratePlanTier3]?.pricing[currencyId] ??
			0
		);
	}

	if (
		[
			'HomeDelivery',
			'SubscriptionCard',
			'GuardianWeeklyDomestic',
			'GuardianWeeklyRestOfWorld',
		].includes(product)
	) {
		return (
			productCatalog[product]?.ratePlans[ratePlan]?.pricing[currencyId] ?? 0
		);
	}

	const ratePlanRegularContribution = getBillingPeriodTitle(billingPeriod);
	return (
		productCatalog[product]?.ratePlans[ratePlanRegularContribution]?.pricing[
			currencyId
		] ?? 0
	);
}
