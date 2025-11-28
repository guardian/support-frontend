import type { EmailMessageWithIdentityUserId } from '@modules/email/email';
import { DataExtensionNames } from '@modules/email/email';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import dayjs from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { User } from '../model/stateSchemas';
import { buildThankYouEmailFields, formatDate } from './emailFields';
import { describePayments, firstPayment } from './paymentDescription';

export function buildGuardianAdLiteEmailFields({
	user,
	subscriptionNumber,
	currency,
	paymentMethod,
	paymentSchedule,
}: {
	user: User;
	subscriptionNumber: string;
	currency: IsoCurrency;
	paymentMethod: PaymentMethod;
	paymentSchedule: PaymentSchedule;
}): EmailMessageWithIdentityUserId {
	const subscriptionDetails = describePayments(
		paymentSchedule,
		BillingPeriod.Monthly, // Guardian Ad Lite is always billed monthly
		currency,
		false,
	);
	const productFields = {
		zuorasubscriberid: subscriptionNumber,
		email_address: user.primaryEmailAddress,
		billing_period: 'monthly',
		first_payment_date: formatDate(dayjs(firstPayment(paymentSchedule).date)),
		payment_method: getPaymentMethodDescription(paymentMethod),
		subscription_details: subscriptionDetails,
	};
	return buildThankYouEmailFields(
		user,
		DataExtensionNames.guardianAdLiteDay0Email,
		productFields,
	);
}

function getPaymentMethodDescription(paymentMethod: PaymentMethod): string {
	switch (paymentMethod.Type) {
		case 'CreditCardReferenceTransaction':
			return 'credit / debit card';
		case 'PayPal':
			return 'PayPal';
		case 'BankTransfer':
			return 'Direct Debit';
	}
}
