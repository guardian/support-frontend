import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { getCurrencyByCode } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import { detect } from 'helpers/internationalisation/currency';
import { simpleFormatAmount } from './forms/checkouts';
import { getBillingPeriodNoun } from './productPrice/billingPeriods';
import {
	getPromotionDiscountedPeriods,
	getPromotionDiscountedPrice,
} from './productPrice/promotionPricing';

export const productLegal = (
	countryGroupId: CountryGroupId,
	billingPeriod: BillingPeriod,
	divider: string,
	thresholdAmount: number,
	promotion?: PromoWithCatalogInformation,
) => {
	const currencyCode = detect(countryGroupId);
	const currency = getCurrencyByCode(currencyCode);
	const amountFormatted = simpleFormatAmount(currency, thresholdAmount);
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	const amountPerPeriod = `${amountFormatted}${divider}${periodNoun}`;

	if (promotion) {
		// EXAMPLE: $8.50/month for the first 6 months, then $17/month
		const promoPrice =
			getPromotionDiscountedPrice(promotion, thresholdAmount, billingPeriod) ??
			thresholdAmount;
		const promoPriceFormatted = simpleFormatAmount(currency, promoPrice);
		const discountDuration =
			getPromotionDiscountedPeriods(promotion, billingPeriod) ?? 0;
		return `${promoPriceFormatted}${divider}${periodNoun} for the first ${
			discountDuration > 1 ? discountDuration : ''
		} ${periodNoun}${discountDuration > 1 ? 's' : ''}, then ${amountPerPeriod}`;
	}

	return amountPerPeriod;
};
