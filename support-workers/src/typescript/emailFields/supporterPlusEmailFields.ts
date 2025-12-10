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
	getPaymentMethodFieldsSupporterPlus,
} from './emailFields';

export function buildSupporterPlusEmailFields({
	now,
	user,
	currency,
	billingPeriod,
	subscriptionNumber,
	paymentSchedule,
	paymentMethod,
	isFixedTerm,
	mandateId,
}: {
	now: dayjs.Dayjs;
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
		now,
		mandateId,
	);
	const productFields = {
		created: zuoraDateFormat(now),
		currency: currency,
		billing_period: billingPeriod.toLowerCase(),
		product: `${billingPeriod.toLowerCase()}-supporter-plus`,
		zuorasubscriberid: nonDeliveryEmailFields.subscriber_id, // This is duplicate and will be removed in a future PR
		subscription_details: nonDeliveryEmailFields.subscription_rate, // This is duplicate and will be removed in a future PR
		is_fixed_term: isFixedTerm.toString(),
		...oldNonStandardPaymentFields,
		...nonDeliveryEmailFields,
	};
	return buildThankYouEmailFields(user, 'supporter-plus', productFields);
}
