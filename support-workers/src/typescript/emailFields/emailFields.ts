import type {
	DataExtensionName,
	EmailMessageWithIdentityUserId,
} from '@modules/email/email';
import type { Dayjs } from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { User } from '../model/stateSchemas';
import { getIfDefined } from '../util/nullAndUndefined';

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
			return {
				payment_method: 'PayPal',
				first_payment_date: formatDate(created),
			};
	}
}
