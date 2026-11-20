import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import { roundAmountUp } from 'helpers/forms/checkouts';
import { getNumberOfMonthsInPeriod } from './billingPeriods';

export function monthlyEquivalentPrice(
	price: number,
	billingPeriod: RecurringBillingPeriod,
) {
	return roundAmountUp(price / getNumberOfMonthsInPeriod(billingPeriod));
}
