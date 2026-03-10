import type { BillingPeriod } from '@modules/product/billingPeriod';
import {
	getBillingPeriodNoun,
	getBillingPeriodTitle,
} from 'helpers/productPrice/billingPeriods';

export default function getWeeklyPromoTerms(
	billingPeriod: BillingPeriod,
	price: string,
	discountedPrice: string,
): string {
	const billingPeriodNoun = getBillingPeriodNoun(billingPeriod);
	const billingPeriodTitle = getBillingPeriodTitle(billingPeriod);

	return `Introductory offer for ${billingPeriodTitle} subscriptions is ${discountedPrice} for the first ${billingPeriodNoun}, then ${price}/${billingPeriodNoun} afterwards unless you cancel. Offer only available to new subscribers who do not have an existing subscription with the Guardian Weekly. Offer ends 12th April 2026.`;
}
