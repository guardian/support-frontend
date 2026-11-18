import type { Currency } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import { getPromotionDiscountedPrice } from 'helpers/productPrice/promotionPricing';

dayjs.extend(advancedFormat);

const discountSummaryCopy = (
	currency: Currency,
	price: number,
	promotion: PromoWithCatalogInformation,
	billingPeriod: BillingPeriod,
) => {
	/**
	 * EXAMPLE:
	 * - £6/month for the first month, then £10/month
	 * - £6.5/month for 6 months, then £10/month
	 * - £173/year for the first year, then £275/year
	 */
	const durationMonths = promotion.discount?.durationMonths ?? 0;
	const formattedPrice = simpleFormatAmount(currency, price);
	const formattedPromotionPrice = simpleFormatAmount(
		currency,
		getPromotionDiscountedPrice(promotion, price, billingPeriod),
	);
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	const duration =
		billingPeriod === BillingPeriod.Annual
			? durationMonths / 12
			: durationMonths;

	return `${formattedPromotionPrice}/${periodNoun} for ${
		periodNoun === 'year' || duration === 1 ? 'the first' : ''
	}${duration > 1 ? duration : ''} ${periodNoun}${
		duration > 1 ? 's' : ''
	}, then ${formattedPrice}/${periodNoun}`;
};

function buildThreeTierCardPromoTerms(
	discountMarker: string,
	productName: string,
	discountSummary: string,
	{ startTimestamp, endTimestamp }: PromoWithCatalogInformation,
): string {
	const startDate = dayjs(startTimestamp).format('Do MMMM'); // eg. 15th January
	const expiryDate = dayjs(endTimestamp).format('Do MMMM YYYY'); // eg. 31st April 2028
	const promoDuration =
		startTimestamp && endTimestamp
			? `Offer starts on the ${startDate} and ends on the ${expiryDate}.`
			: '';

	return ` ${discountMarker} ${productName} offer is ${discountSummary} afterwards unless you cancel.
			Offer only available to new subscribers who do not have an existing subscription with the Guardian. 
			${promoDuration}`;
}

export { discountSummaryCopy, buildThreeTierCardPromoTerms };
