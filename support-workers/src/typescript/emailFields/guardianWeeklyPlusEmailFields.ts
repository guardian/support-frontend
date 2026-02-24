import type { EmailMessageWithIdentityUserId } from '@modules/email/email';
import { DataExtensionNames } from '@modules/email/email';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import type { ProductPurchase } from '@modules/product-catalog/productPurchaseSchema';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { GiftRecipient, User } from '../model/stateSchemas';
import { buildDeliveryEmailFields } from './deliveryEmailFields';
import { buildEmailFields } from './emailFields';
import { formatDate } from './paymentEmailFields';

export type GuardianWeeklyProductPurchase = Extract<
	ProductPurchase,
	{ product: 'GuardianWeeklyDomestic' | 'GuardianWeeklyRestOfWorld' }
>;

export function buildGuardianWeeklyPlusEmailFields({
	today,
	user,
	currency,
	billingPeriod,
	subscriptionNumber,
	paymentSchedule,
	paymentMethod,
	isFixedTerm,
	mandateId,
	giftRecipient,
}: {
	today: Dayjs;
	user: User;
	currency: IsoCurrency;
	billingPeriod: RecurringBillingPeriod;
	subscriptionNumber: string;
	paymentSchedule: PaymentSchedule;
	paymentMethod: PaymentMethod;
	isFixedTerm: boolean;
	mandateId?: string;
	giftRecipient?: GiftRecipient;
}): EmailMessageWithIdentityUserId {
	const gifteeFields = giftRecipient
		? {
				giftee_first_name: giftRecipient.firstName,
				giftee_last_name: giftRecipient.lastName,
		  }
		: undefined;

	const secondPaymentFields = paymentSchedule.payments[1]
		? {
				date_of_second_payment: formatDate(
					dayjs(paymentSchedule.payments[1].date),
				),
		  }
		: undefined;

	const deliveryFields = buildDeliveryEmailFields({
		today: today,
		user: user,
		subscriptionNumber: subscriptionNumber,
		currency: currency,
		billingPeriod: billingPeriod,
		paymentMethod: paymentMethod,
		paymentSchedule: paymentSchedule,
		isFixedTerm: isFixedTerm,
		mandateId: mandateId,
	});
	const productFields = {
		...secondPaymentFields,
		...gifteeFields,
		...deliveryFields,
	};
	return buildEmailFields(
		user,
		DataExtensionNames.day0Emails.guardianWeeklyPlus,
		productFields,
	);
}
