import type { BillingPeriod } from '@modules/product/billingPeriod';
import type { ContributionType } from 'helpers/contributions';
import { contributionTypeToBillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';

export interface TierPlanCost {
	price: number;
	promoCode?: string;
	discount?: {
		percentage: number;
		price: number;
		duration: { value: number; period: BillingPeriod };
	};
}

/**
 * @deprecated - we should be using ProductCatalog data types.
 * TODO - remove this once TsAndCs works on ProductCatalog data types
 */
export function getTierPlanCost(
	price: number,
	contributionType: ContributionType,
	promotion?: Promotion,
): TierPlanCost {
	const promotionDurationPeriod: ContributionType =
		contributionType === 'ANNUAL' && promotion?.discount?.durationMonths === 12
			? 'ANNUAL'
			: 'MONTHLY';

	const promotionDurationValue =
		promotionDurationPeriod === 'ANNUAL'
			? 1
			: promotion?.discount?.durationMonths;

	return {
		price,
		promoCode: promotion?.name,
		discount:
			promotion?.discount?.amount && promotion.discountedPrice
				? {
						percentage: promotion.discount.amount,
						price: promotion.discountedPrice,
						duration: {
							value: promotionDurationValue ?? 0,
							period: contributionTypeToBillingPeriod(promotionDurationPeriod),
						},
				  }
				: undefined,
	};
}
