import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { getCurrencyInfo } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { detect } from 'helpers/internationalisation/currency';
import type { Promotion } from 'helpers/productPrice/promotions';
import { simpleFormatAmount } from './forms/checkouts';
import { getBillingPeriodNoun } from './productPrice/billingPeriods';

export const productLegal = (
	countryGroupId: CountryGroupId,
	billingPeriod: BillingPeriod,
	divider: string,
	thresholdAmount: number,
	promotion?: Promotion,
) => {
	const isoCurrency = detect(countryGroupId);
	const currency = getCurrencyInfo(isoCurrency);
	const amountFormatted = simpleFormatAmount(currency, thresholdAmount);
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	const amountPerPeriod = `${amountFormatted}${divider}${periodNoun}`;

	if (promotion) {
		// EXAMPLE: $8.50/month for the first 6 months, then $17/month
		const promoPrice = promotion.discountedPrice ?? thresholdAmount;
		const promoPriceFormatted = simpleFormatAmount(currency, promoPrice);
		const discountDuration = promotion.numberOfDiscountedPeriods ?? 0;
		return `${promoPriceFormatted}${divider}${periodNoun} for the first ${
			discountDuration > 1 ? discountDuration : ''
		} ${periodNoun}${discountDuration > 1 ? 's' : ''}, then ${amountPerPeriod}`;
	}

	return amountPerPeriod;
};
