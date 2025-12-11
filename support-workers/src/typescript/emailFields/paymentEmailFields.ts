import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import { getIfDefined } from '../util/nullAndUndefined';

const DIRECT_DEBIT_LEAD_TIME_DAYS = 10;

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

export type EmailPaymentFields =
	| {
			payment_method: 'Credit/Debit Card' | 'PayPal';
			first_payment_date: string;
	  }
	| {
			payment_method: 'Direct Debit';
			first_payment_date: string;
			account_holder: string;
			bank_account_no: string;
			bank_sort_code: string;
			mandate_id: string;
	  };

export function getPaymentFields(
	today: Dayjs,
	paymentMethod: PaymentMethod,
	firstZuoraPaymentDate: Dayjs,
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
				first_payment_date: formatDate(
					dayjs.max(
						firstZuoraPaymentDate,
						today.add(DIRECT_DEBIT_LEAD_TIME_DAYS, 'day'),
					),
				),
			};
		case 'CreditCardReferenceTransaction':
			return {
				payment_method: 'Credit/Debit Card',
				first_payment_date: formatDate(firstZuoraPaymentDate),
			};
		case 'PayPal':
		case 'PayPalCompletePaymentsWithBAID':
			return {
				payment_method: 'PayPal',
				first_payment_date: formatDate(firstZuoraPaymentDate),
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
