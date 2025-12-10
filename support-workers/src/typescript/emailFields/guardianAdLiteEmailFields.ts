import type { EmailMessageWithIdentityUserId } from '@modules/email/email';
import { DataExtensionNames } from '@modules/email/email';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { Dayjs } from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { User } from '../model/stateSchemas';
import {
	buildNonDeliveryEmailFields,
	buildThankYouEmailFields,
} from './emailFields';

export function buildGuardianAdLiteEmailFields({
	today,
	user,
	subscriptionNumber,
	currency,
	paymentMethod,
	paymentSchedule,
	mandateId,
}: {
	today: Dayjs;
	user: User;
	subscriptionNumber: string;
	currency: IsoCurrency;
	paymentMethod: PaymentMethod;
	paymentSchedule: PaymentSchedule;
	mandateId?: string;
}): EmailMessageWithIdentityUserId {
	const nonDeliveryEmailFields = buildNonDeliveryEmailFields({
		today: today,
		user,
		subscriptionNumber,
		currency,
		billingPeriod: BillingPeriod.Monthly,
		paymentMethod,
		paymentSchedule,
		mandateId: mandateId,
		isFixedTerm: false, // Guardian Ad-Lite has no fixed term rate plans
	});

	const productFields = {
		zuorasubscriberid: subscriptionNumber,
		billing_period: 'monthly',
		subscription_details: nonDeliveryEmailFields.subscription_rate, // Duplicate, to be removed in a future PR
		...nonDeliveryEmailFields,
	};
	return buildThankYouEmailFields(
		user,
		DataExtensionNames.guardianAdLiteDay0Email,
		productFields,
	);
}
