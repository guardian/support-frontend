import type { RegularContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	currencies,
	detect,
	fromCountryGroupId,
} from 'helpers/internationalisation/currency';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { ProductsThresholdDefined } from 'helpers/supporterPlus/benefitsThreshold';
import { getLowerProductBenefitThreshold } from 'helpers/supporterPlus/benefitsThreshold';
import { simpleFormatAmount } from './forms/checkouts';

export const productLegal = (
	countryGroupId: CountryGroupId,
	contributionType: RegularContributionType,
	divider: string,
	product: ProductsThresholdDefined,
	promotion?: Promotion,
) => {
	const isoCurrency = detect(countryGroupId);
	const currency = currencies[isoCurrency];
	const amount = getLowerProductBenefitThreshold(
		contributionType,
		fromCountryGroupId(countryGroupId),
		countryGroupId,
		product,
	);
	const amountFormatted = simpleFormatAmount(currency, amount);
	const period = contributionType === 'MONTHLY' ? 'month' : 'year';
	const amountPerPeriod = `${amountFormatted}${divider}${period}`;

	if (promotion) {
		// EXAMPLE: $8.50/month for the first 6 months, then $17/month
		const promoPrice = promotion.discountedPrice ?? amount;
		const promoPriceFormatted = simpleFormatAmount(currency, promoPrice);
		const discountDuration = promotion.numberOfDiscountedPeriods ?? 0;
		return `${promoPriceFormatted}${divider}${period} for the first ${
			discountDuration > 1 ? discountDuration : ''
		} ${period}${discountDuration > 1 ? 's' : ''}, then ${amountPerPeriod}`;
	}

	return amountPerPeriod;
};
