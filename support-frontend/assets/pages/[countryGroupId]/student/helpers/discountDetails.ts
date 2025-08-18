import { BillingPeriod } from '@modules/product/billingPeriod';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';

export function getDiscountDuration({
	durationInMonths,
}: {
	durationInMonths: number;
}) {
	const isYearly = durationInMonths % 12 === 0;
	const duration = isYearly ? durationInMonths / 12 : durationInMonths;
	const billingPeriod = isYearly ? BillingPeriod.Annual : BillingPeriod.Monthly;

	const periodNoun = getBillingPeriodNoun(billingPeriod);

	switch (duration) {
		case 1:
			return `the first ${periodNoun}`;
		case 2:
			return `two ${periodNoun}s`;
		default:
			return `${duration} ${periodNoun}s`;
	}
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
	console.log('***', periodNoun);
	const discountDuration = getDiscountDuration({
		durationInMonths,
	});

	return `${discountPriceWithCurrency}/${periodNoun} for ${discountDuration}, then ${priceWithCurrency}/${periodNoun}${'*'.repeat(
		promoCount,
	)}`;
}
