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

export function getPaymentMethodFieldsSupporterPlus(
	paymentMethod: PaymentMethod,
	created: Dayjs,
	mandateId?: string,
):
	| { 'payment method': 'credit / debit card'; 'first payment date': string }
	| {
			'payment method': 'Direct Debit';
			'account name': string;
			'account number': string;
			'sort code': string;
			'Mandate ID': string;
			'first payment date': string;
	  }
	| { 'payment method': 'PayPal'; 'first payment date': string } {
	switch (paymentMethod.Type) {
		case 'BankTransfer':
			return {
				'payment method': 'Direct Debit',
				'account name': paymentMethod.BankTransferAccountName,
				'account number': paymentMethod.BankTransferAccountNumber,
				'sort code': paymentMethod.BankCode,
				'Mandate ID': getIfDefined(
					mandateId,
					'No Mandate ID was provided for a Direct Debit payment',
				),
				'first payment date': formatDate(created.add(10, 'days')),
			};
		case 'CreditCardReferenceTransaction':
			return {
				'payment method': 'credit / debit card',
				'first payment date': formatDate(created),
			};
		case 'PayPal':
			return {
				'payment method': 'PayPal',
				'first payment date': formatDate(created),
			};
	}
}
