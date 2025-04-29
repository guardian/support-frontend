import {
	config,
	type RegularContributionTypeQuarterly,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { currencies, detect } from 'helpers/internationalisation/currency';
import type { Promotion } from 'helpers/productPrice/promotions';
import { simpleFormatAmount } from './forms/checkouts';

export const productLegal = (
	countryGroupId: CountryGroupId,
	contributionType: RegularContributionTypeQuarterly,
	divider: string,
	thresholdAmount: number,
	promotion?: Promotion,
) => {
	const isoCurrency = detect(countryGroupId);
	const currency = currencies[isoCurrency];
	const amountFormatted = simpleFormatAmount(currency, thresholdAmount);
	const frequencySingular =
		config[countryGroupId][contributionType].frequencySingular;
	const amountPerPeriod = `${amountFormatted}${divider}${frequencySingular}`;

	if (promotion) {
		// EXAMPLE: $8.50/month for the first 6 months, then $17/month
		const promoPrice = promotion.discountedPrice ?? thresholdAmount;
		const promoPriceFormatted = simpleFormatAmount(currency, promoPrice);
		const discountDuration = promotion.numberOfDiscountedPeriods ?? 0;
		return `${promoPriceFormatted}${divider}${frequencySingular} for the first ${
			discountDuration > 1 ? discountDuration : ''
		} ${frequencySingular}${
			discountDuration > 1 ? 's' : ''
		}, then ${amountPerPeriod}`;
	}

	return amountPerPeriod;
};
