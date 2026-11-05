import type { BillingPeriod } from '@modules/product/billingPeriod';
import { roundAmountUp } from 'helpers/forms/checkouts';
import { getNumberOfMonthsInPeriod } from './billingPeriods';

export function monthlyEquivalentPrice(
	price: number,
	billingPeriod: BillingPeriod.Annual | BillingPeriod.Quarterly,
) {
	return roundAmountUp(price / getNumberOfMonthsInPeriod(billingPeriod));
}
