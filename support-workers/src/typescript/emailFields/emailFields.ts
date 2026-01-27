import type { IsoCurrency } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import type {
	DataExtensionName,
	EmailMessageWithIdentityUserId,
} from '@modules/email/email';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { User } from '../model/stateSchemas';
import { describePayments, firstPayment } from './paymentDescription';
import type { EmailPaymentFields } from './paymentEmailFields';
import { getPaymentFields } from './paymentEmailFields';

type EmailCommonFields = {
	first_name: string;
	last_name: string;
	subscriber_id: string;
	subscription_rate: string;
};

export type NonDeliveryEmailFields = EmailCommonFields & EmailPaymentFields;

export function buildNonDeliveryEmailFields({
	today,
	user,
	subscriptionNumber,
	currency,
	billingPeriod,
	paymentMethod,
	paymentSchedule,
	isFixedTerm,
	mandateId,
}: {
	today: Dayjs;
	user: User;
	subscriptionNumber: string;
	currency: IsoCurrency;
	billingPeriod: RecurringBillingPeriod;
	paymentMethod: PaymentMethod;
	paymentSchedule: PaymentSchedule;
	isFixedTerm: boolean;
	mandateId?: string;
}): NonDeliveryEmailFields {
	const paymentFields = getPaymentFields(
		today,
		paymentMethod,
		dayjs(firstPayment(paymentSchedule).date),
		mandateId,
	);
	const subscriptionDetails = describePayments(
		paymentSchedule,
		billingPeriod,
		currency,
		isFixedTerm,
	);
	return {
		first_name: user.firstName,
		last_name: user.lastName,
		subscriber_id: subscriptionNumber,
		subscription_rate: subscriptionDetails,
		...paymentFields,
	};
}

export function buildEmailFields(
	user: User,
	dataExtensionName: DataExtensionName,
	productSpecificFields: Record<string, string>,
	sfContactId?: string,
): EmailMessageWithIdentityUserId {
	return {
		To: {
			Address: user.primaryEmailAddress,
			ContactAttributes: {
				SubscriberAttributes: {
					...productSpecificFields,
				},
			},
		},
		DataExtensionName: dataExtensionName,
		IdentityUserId: user.id,
		...(sfContactId ? { SfContactId: sfContactId } : undefined),
	};
}
