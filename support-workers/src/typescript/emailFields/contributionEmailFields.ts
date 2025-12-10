import type { EmailMessageWithIdentityUserId } from '@modules/email/email';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import type dayjs from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { User } from '../model/stateSchemas';
import {
	buildNonDeliveryEmailFields,
	buildThankYouEmailFields,
	getPaymentMethodFieldsSupporterPlus,
} from './emailFields';

export function buildContributionEmailFields(input: {
	now: dayjs.Dayjs;
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
		isFixedTerm: false, // There are no fixed term contribution rate plans
		...input,
	});

	const oldNonStandardPaymentFields = getPaymentMethodFieldsSupporterPlus(
		input.paymentMethod,
		input.now,
		input.mandateId,
	);

	const productFields = {
		created: input.now.toISOString(),
		amount: input.amount.toString(),
		edition: input.user.billingAddress.country,
		name: nonDeliveryEmailFields.first_name, // This is duplicate and will be removed in a future PR
		product: `${input.ratePlan.toLowerCase()}-contribution`,
		currency: input.currency,
		...oldNonStandardPaymentFields,
		...nonDeliveryEmailFields,
	};

	return buildThankYouEmailFields(
		input.user,
		'regular-contribution-thank-you',
		productFields,
	);
}
