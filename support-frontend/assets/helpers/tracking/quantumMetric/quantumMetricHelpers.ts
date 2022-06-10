import type {
	DigitalBillingPeriod,
	DigitalGiftBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { getAppliedPromo } from 'helpers/productPrice/promotions';

export const getAnnualValue = (
	productPrice: ProductPrice,
	billingPeriod: DigitalBillingPeriod | DigitalGiftBillingPeriod,
): number => {
	const fullPrice = productPrice.price;
	const promotion = getAppliedPromo(productPrice.promotions);

	const periodMultiplier: Record<
		DigitalBillingPeriod | DigitalGiftBillingPeriod,
		number
	> = {
		Annual: 1,
		Monthly: 12,
		Quarterly: 4,
	};
	const fullPriceInPenceCents = fullPrice * 100;
	const fullAnnualPrice =
		fullPriceInPenceCents * periodMultiplier[billingPeriod];

	if (!promotion?.discountedPrice || !promotion.numberOfDiscountedPeriods) {
		return fullAnnualPrice;
	}

	const discountedPriceInPenceCents = promotion.discountedPrice * 100;
	const discountInPenceCents =
		fullPriceInPenceCents - discountedPriceInPenceCents;

	const discountedAnnualPrice =
		fullAnnualPrice -
		discountInPenceCents * promotion.numberOfDiscountedPeriods;

	return discountedAnnualPrice;
};
