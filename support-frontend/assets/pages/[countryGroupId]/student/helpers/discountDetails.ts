import { BillingPeriod } from '@modules/product/billingPeriod';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';

export function getDiscountDuration({
	durationInMonths,
	billingPeriod,
}: {
	durationInMonths: number;
	billingPeriod: BillingPeriod;
}) {
	const duration =
		billingPeriod === BillingPeriod.Annual
			? durationInMonths / 12
			: durationInMonths;
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	return duration === 1
		? `the first ${periodNoun}`
		: `${duration} ${periodNoun}s`;
}

export function getDiscountSummary({
	priceWithCurrency,
	discountPriceWithCurrency,
	durationInMonths,
	billingPeriod,
	promoCount = 0,
}: {
	priceWithCurrency: string;
	discountPriceWithCurrency: string;
	durationInMonths: number;
	billingPeriod: BillingPeriod;
	promoCount?: number;
}) {
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	const discountDuration = getDiscountDuration({
		durationInMonths,
		billingPeriod,
	});

	return `${discountPriceWithCurrency}/${periodNoun} for ${discountDuration}, then ${priceWithCurrency}/${periodNoun}${'*'.repeat(
		promoCount,
	)}`;
}
