import type { EmailMessageWithIdentityUserId } from '@modules/email/email';
import { DataExtensionNames } from '@modules/email/email';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import type { ProductPurchase } from '@modules/product-catalog/productPurchaseSchema';
import dayjs from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { GiftRecipient, User } from '../model/stateSchemas';
import { buildDeliveryEmailFields } from './deliveryEmailFields';
import { buildThankYouEmailFields, formatDate } from './emailFields';
import { describePayments, firstPayment } from './paymentDescription';

type GuardianWeeklyProductPurchase = Extract<
	ProductPurchase,
	{ product: 'GuardianWeeklyDomestic' | 'GuardianWeeklyRestOfWorld' }
>;

export function buildGuardianWeeklyEmailFields({
	user,
	currency,
	billingPeriod,
	subscriptionNumber,
	paymentSchedule,
	paymentMethod,
	productInformation,
	isFixedTerm,
	mandateId,
	giftRecipient,
}: {
	user: User;
	currency: IsoCurrency;
	billingPeriod: RecurringBillingPeriod;
	subscriptionNumber: string;
	paymentSchedule: PaymentSchedule;
	paymentMethod: PaymentMethod;
	productInformation: GuardianWeeklyProductPurchase;
	isFixedTerm: boolean;
	mandateId?: string;
	giftRecipient?: GiftRecipient | null;
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
		subscriptionNumber: subscriptionNumber,
		user: user,
		firstDeliveryDate: dayjs(productInformation.firstDeliveryDate),
		firstPaymentDate: dayjs(firstPayment(paymentSchedule).date),
		paymentDescription: describePayments(
			paymentSchedule,
			billingPeriod,
			currency,
			isFixedTerm,
		),
		paymentMethod: paymentMethod,
		mandateId: mandateId,
	});
	const productFields = {
		...secondPaymentFields,
		...gifteeFields,
		...deliveryFields,
	};
	return buildThankYouEmailFields(
		user,
		DataExtensionNames.guardianWeeklyDay0Email,
		productFields,
	);
}
