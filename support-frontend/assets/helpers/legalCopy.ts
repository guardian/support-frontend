import type { RegularContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { currencies, detect } from 'helpers/internationalisation/currency';
import type { Promotion } from 'helpers/productPrice/promotions';
import { simpleFormatAmount } from './forms/checkouts';

export const productLegal = (
	countryGroupId: CountryGroupId,
	contributionType: RegularContributionType,
	divider: string,
	amount: number,
	promotion?: Promotion,
) => {
	const isoCurrency = detect(countryGroupId);
	const currency = currencies[isoCurrency];
	const amountFormatted = simpleFormatAmount(currency, amount);
	const period = contributionType === 'MONTHLY' ? 'month' : 'year';
	const amountPerPeriod = `${amountFormatted}${divider}${period}`;

	if (promotion) {
		// EXAMPLE: $8.50/month for the first 6 months, then $17/month
		const promoPrice = promotion.discountedPrice ?? thresholdAmount;
		const promoPriceFormatted = simpleFormatAmount(currency, promoPrice);
		const discountDuration = promotion.numberOfDiscountedPeriods ?? 0;
		return `${promoPriceFormatted}${divider}${period} for the first ${
			discountDuration > 1 ? discountDuration : ''
		} ${period}${discountDuration > 1 ? 's' : ''}, then ${amountPerPeriod}`;
	}

	return amountPerPeriod;
};
