import type { EmailMessageWithIdentityUserId } from '@modules/email/email';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import type { Dayjs } from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { User } from '../model/stateSchemas';
import {
	buildNonDeliveryEmailFields,
	buildThankYouEmailFields,
} from './emailFields';
import { getPaymentMethodFieldsSupporterPlus } from './paymentEmailFields';

export function buildContributionEmailFields({
	today,
	user,
	amount,
	currency,
	billingPeriod,
	subscriptionNumber,
	paymentSchedule,
	paymentMethod,
	mandateId,
	ratePlan,
}: {
	today: Dayjs;
	user: User;
	amount: number;
	currency: IsoCurrency;
	billingPeriod: RecurringBillingPeriod;
	subscriptionNumber: string;
	paymentSchedule: PaymentSchedule;
	paymentMethod: PaymentMethod;
	mandateId?: string;
	ratePlan: 'Annual' | 'Monthly';
}): EmailMessageWithIdentityUserId {
	const nonDeliveryEmailFields = buildNonDeliveryEmailFields({
		today: today,
		user,
		subscriptionNumber,
		currency,
		billingPeriod,
		paymentMethod,
		paymentSchedule,
		mandateId,
		isFixedTerm: false, // There are no fixed term contribution rate plans
	});

	const oldNonStandardPaymentFields = getPaymentMethodFieldsSupporterPlus(
		paymentMethod,
		today,
		mandateId,
	);

	const productFields = {
		created: today.toISOString(),
		amount: amount.toString(),
		edition: user.billingAddress.country,
		name: nonDeliveryEmailFields.first_name, // This is duplicate and will be removed in a future PR
		product: `${ratePlan.toLowerCase()}-contribution`,
		currency,
		...oldNonStandardPaymentFields,
		...nonDeliveryEmailFields,
	};

	return buildThankYouEmailFields(
		user,
		'regular-contribution-thank-you',
		productFields,
	);
}
