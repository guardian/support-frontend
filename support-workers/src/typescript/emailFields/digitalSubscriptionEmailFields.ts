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

export function buildDigitalSubscriptionEmailFields({
	today,
	user,
	currency,
	billingPeriod,
	subscriptionNumber,
	paymentSchedule,
	paymentMethod,
	mandateId,
}: {
	today: Dayjs;
	user: User;
	currency: IsoCurrency;
	billingPeriod: RecurringBillingPeriod;
	subscriptionNumber: string;
	paymentSchedule: PaymentSchedule;
	paymentMethod: PaymentMethod;
	mandateId?: string;
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
		isFixedTerm: false, // There are no fixed term Digital subscription rate plans
	});

	const productFields = {
		currency: currency,
		...nonDeliveryEmailFields,
	};
	return buildThankYouEmailFields(user, 'digipack', productFields);
}
