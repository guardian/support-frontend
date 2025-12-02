import type { EmailMessageWithIdentityUserId } from '@modules/email/email';
import { DataExtensionNames } from '@modules/email/email';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import type { ProductPurchase } from '@modules/product-catalog/productPurchaseSchema';
import dayjs from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { User } from '../model/stateSchemas';
import { buildDeliveryEmailFields } from './deliveryEmailFields';
import { buildThankYouEmailFields, formatDate } from './emailFields';
import { describePayments, firstPayment } from './paymentDescription';

export type TierThreeProductPurchase = Extract<
	ProductPurchase,
	{ product: 'TierThree' }
>;

export function buildTierThreeEmailFields({
	user,
	currency,
	billingPeriod,
	subscriptionNumber,
	paymentSchedule,
	paymentMethod,
	mandateId,
	productInformation,
}: {
	user: User;
	currency: IsoCurrency;
	billingPeriod: RecurringBillingPeriod;
	subscriptionNumber: string;
	paymentSchedule: PaymentSchedule;
	paymentMethod: PaymentMethod;
	mandateId?: string;
	productInformation: TierThreeProductPurchase;
}): EmailMessageWithIdentityUserId {
	const firstPaymentDate = dayjs(firstPayment(paymentSchedule).date);
	const additionalFields: Record<string, string> = {
		billing_period: billingPeriod.toLowerCase(),
		first_payment_date: formatDate(firstPaymentDate),
		subscription_details: describePayments(
			paymentSchedule,
			billingPeriod,
			currency,
			false,
		),
	};
	const deliveryFields = buildDeliveryEmailFields({
		subscriptionNumber: subscriptionNumber,
		user: user,
		firstDeliveryDate: dayjs(productInformation.firstDeliveryDate),
		firstPaymentDate: dayjs(firstPayment(paymentSchedule).date),
		paymentDescription: describePayments(
			paymentSchedule,
			billingPeriod,
			currency,
			false,
		),
		paymentMethod: paymentMethod,
		mandateId: mandateId,
	});
	const productFields = {
		...additionalFields,
		...deliveryFields,
	};
	return buildThankYouEmailFields(
		user,
		DataExtensionNames.tierThreeDay0Email,
		productFields,
	);
}
