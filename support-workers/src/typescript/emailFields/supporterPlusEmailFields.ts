import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import { zuoraDateFormat } from '@modules/zuora/utils/common';
import type dayjs from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { User } from '../model/stateSchemas';
import {
	buildNonDeliveryEmailFields,
	buildThankYouEmailFields,
} from './emailFields';
import { getPaymentMethodFieldsSupporterPlus } from './paymentEmailFields';

export function buildSupporterPlusEmailFields({
	today,
	user,
	currency,
	billingPeriod,
	subscriptionNumber,
	paymentSchedule,
	paymentMethod,
	isFixedTerm,
	mandateId,
}: {
	today: dayjs.Dayjs;
	user: User;
	currency: IsoCurrency;
	billingPeriod: RecurringBillingPeriod;
	subscriptionNumber: string;
	paymentSchedule: PaymentSchedule;
	paymentMethod: PaymentMethod;
	isFixedTerm: boolean;
	mandateId?: string;
}) {
	const nonDeliveryEmailFields = buildNonDeliveryEmailFields({
		today: today,
		user,
		subscriptionNumber,
		currency,
		billingPeriod,
		paymentMethod,
		paymentSchedule,
		mandateId,
		isFixedTerm,
	});
	const oldNonStandardPaymentFields = getPaymentMethodFieldsSupporterPlus(
		paymentMethod,
		today,
		mandateId,
	);
	const productFields = {
		created: zuoraDateFormat(today),
		currency: currency,
		billing_period: billingPeriod.toLowerCase(),
		product: `${billingPeriod.toLowerCase()}-supporter-plus`,
		is_fixed_term: isFixedTerm.toString(),
		...oldNonStandardPaymentFields,
		...nonDeliveryEmailFields,
	};
	return buildThankYouEmailFields(user, 'supporter-plus', productFields);
}
