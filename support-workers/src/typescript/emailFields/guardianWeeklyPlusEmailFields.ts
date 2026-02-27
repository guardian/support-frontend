import type { EmailMessageWithIdentityUserId } from '@modules/email/email';
import { DataExtensionNames } from '@modules/email/email';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import type { ProductPurchase } from '@modules/product-catalog/productPurchaseSchema';
import type { Dayjs } from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { User } from '../model/stateSchemas';
import { buildDeliveryEmailFields } from './deliveryEmailFields';
import { buildEmailFields } from './emailFields';

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
}): EmailMessageWithIdentityUserId {
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

	return buildEmailFields(
		user,
		DataExtensionNames.day0Emails.guardianWeeklyPlus,
		deliveryFields,
	);
}
