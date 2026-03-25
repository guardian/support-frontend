import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { productCatalog } from 'helpers/productCatalog';
import { getBillingPeriodTitle } from 'helpers/productPrice/billingPeriods';

export function getLowerProductBenefitThreshold(
	billingPeriod: BillingPeriod,
	currencyId: IsoCurrency,
	product: ActiveProductKey,
	ratePlan: ActiveRatePlanKey,
): number {
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
