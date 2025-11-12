import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { zuoraDateFormat } from '@modules/zuora/utils/common';
import type dayjs from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { User } from '../model/stateSchemas';
import { describe } from './emailFieldDescription';
import {
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
	billingPeriod: BillingPeriod;
	subscriptionNumber: string;
	paymentSchedule: PaymentSchedule;
	paymentMethod: PaymentMethod;
	isFixedTerm: boolean;
	mandateId?: string;
}) {
	const paymentMethodFields = getPaymentMethodFieldsSupporterPlus(
		paymentMethod,
		now,
		mandateId,
	);
	const productFields = {
		email_address: user.primaryEmailAddress,
		created: zuoraDateFormat(now),
		currency: currency,
		first_name: user.firstName,
		last_name: user.lastName,
		billing_period: billingPeriod.toLowerCase(),
		product: `${billingPeriod.toLowerCase()}-supporter-plus`,
		zuorasubscriberid: subscriptionNumber,
		subscription_details: describe(
			paymentSchedule,
			billingPeriod,
			currency,
			isFixedTerm,
		),
		is_fixed_term: isFixedTerm.toString(),
		...paymentMethodFields,
	};
	return buildThankYouEmailFields(user, 'supporter-plus', productFields);
}
