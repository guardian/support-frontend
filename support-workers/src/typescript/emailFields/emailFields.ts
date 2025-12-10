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
import { getIfDefined } from '../util/nullAndUndefined';
import { describePayments, firstPayment } from './paymentDescription';

export type EmailCommonFields = {
	first_name: string;
	last_name: string;
	subscriber_id: string;
	first_payment_date: string;
	subscription_rate: string;
};

export type EmailPaymentFields =
	| { payment_method: 'Credit/Debit Card' | 'PayPal' }
	| {
			payment_method: 'Direct Debit';
			account_holder: string;
			bank_account_no: string;
			bank_sort_code: string;
			mandate_id: string;
	  };

export type NonDeliveryEmailFields = EmailCommonFields & EmailPaymentFields;

export function buildNonDeliveryEmailFields({
	user,
	subscriptionNumber,
	currency,
	billingPeriod,
	paymentMethod,
	paymentSchedule,
	isFixedTerm,
	mandateId,
}: {
	user: User;
	subscriptionNumber: string;
	currency: IsoCurrency;
	billingPeriod: RecurringBillingPeriod;
	paymentMethod: PaymentMethod;
	paymentSchedule: PaymentSchedule;
	isFixedTerm: boolean;
	mandateId?: string;
}): NonDeliveryEmailFields {
	const paymentFields = getPaymentFields(paymentMethod, mandateId);
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
		first_payment_date: formatDate(dayjs(firstPayment(paymentSchedule).date)),
		subscription_rate: subscriptionDetails,
		...paymentFields,
	};
}

export function getPaymentFields(
	paymentMethod: PaymentMethod,
	mandateId?: string,
): EmailPaymentFields {
	switch (paymentMethod.Type) {
		case 'BankTransfer':
			return {
				bank_account_no: mask(paymentMethod.BankTransferAccountNumber),
				bank_sort_code: hyphenate(paymentMethod.BankCode),
				account_holder: paymentMethod.BankTransferAccountName,
				payment_method: 'Direct Debit',
				mandate_id: mandateId ?? '',
			};
		case 'CreditCardReferenceTransaction':
			return {
				payment_method: 'Credit/Debit Card',
			};
		case 'PayPal':
		case 'PayPalCompletePaymentsWithBAID':
			return {
				payment_method: 'PayPal',
			};
	}
}

export function getPaymentMethodFieldsSupporterPlus(
	paymentMethod: PaymentMethod,
	created: Dayjs,
	mandateId?: string,
):
	| {
			payment_method: 'credit / debit card' | 'PayPal';
			first_payment_date: string;
	  }
	| {
			payment_method: 'Direct Debit';
			account_name: string;
			account_number: string;
			sort_code: string;
			Mandate_ID: string;
			first_payment_date: string;
	  } {
	const DIRECT_DEBIT_LEAD_TIME_DAYS = 10;
	switch (paymentMethod.Type) {
		case 'BankTransfer':
			return {
				payment_method: 'Direct Debit',
				account_name: paymentMethod.BankTransferAccountName,
				account_number: mask(paymentMethod.BankTransferAccountNumber),
				sort_code: paymentMethod.BankCode,
				Mandate_ID: getIfDefined(
					mandateId,
					'No Mandate ID was provided for a Direct Debit payment',
				),
				first_payment_date: formatDate(
					created.add(DIRECT_DEBIT_LEAD_TIME_DAYS, 'days'),
				),
			};
		case 'CreditCardReferenceTransaction':
			return {
				payment_method: 'credit / debit card',
				first_payment_date: formatDate(created),
			};
		case 'PayPal':
		case 'PayPalCompletePaymentsWithBAID':
			return {
				payment_method: 'PayPal',
				first_payment_date: formatDate(created),
			};
	}
}

export function buildThankYouEmailFields(
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

export function formatDate(date: Dayjs) {
	return date.format('dddd, D MMMM YYYY');
}

export function mask(accountNumber: string): string {
	// Replace all but the last two characters with asterisks
	return accountNumber.replace(/.(?=.{2})/g, '*');
}

export function hyphenate(sortCode: string): string {
	return sortCode.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3');
}
