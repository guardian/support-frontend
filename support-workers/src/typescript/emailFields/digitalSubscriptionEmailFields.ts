import type { EmailMessageWithIdentityUserId } from '@modules/email/email';
import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import type { Dayjs } from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { User } from '../model/stateSchemas';
import { getIfDefined } from '../util/nullAndUndefined';
import {
	buildNonDeliveryEmailFields,
	buildThankYouEmailFields,
} from './emailFields';

function getOldNonStandardPaymentFields(
	paymentMethod: PaymentMethod,
	mandateId?: string,
):
	| {
			sort_code: string;
			account_name: string;
			default_payment_method: 'Direct Debit';
			account_number: string;
			mandateid: string;
	  }
	| { default_payment_method: 'Credit/Debit Card' | 'PayPal' } {
	switch (paymentMethod.Type) {
		case 'BankTransfer':
			return {
				sort_code: paymentMethod.BankCode,
				account_name: paymentMethod.BankTransferAccountName,
				default_payment_method: 'Direct Debit',
				account_number: paymentMethod.BankTransferAccountNumber,
				mandateid: getIfDefined(
					mandateId,
					'No Mandate ID was provided for a Direct Debit payment',
				),
			};
		case 'CreditCardReferenceTransaction':
			return {
				default_payment_method: 'Credit/Debit Card',
			};
		case 'PayPal':
		case 'PayPalCompletePaymentsWithBAID':
			return {
				default_payment_method: 'PayPal',
			};
	}
}
export function buildDigitalSubscriptionEmailFields({
	today,
	user,
	currency,
	billingPeriod,
	subscriptionNumber,
	paymentSchedule,
	paymentMethod,
	mandateId,
}: {
	today: Dayjs;
	user: User;
	currency: IsoCurrency;
	billingPeriod: RecurringBillingPeriod;
	subscriptionNumber: string;
	paymentSchedule: PaymentSchedule;
	paymentMethod: PaymentMethod;
	mandateId?: string;
}): EmailMessageWithIdentityUserId {
	const nonDeliveryEmailFields = buildNonDeliveryEmailFields({
		today: today,
		user,
		subscriptionNumber,
		currency,
		billingPeriod,
		paymentMethod,
		paymentSchedule,
		mandateId,
		isFixedTerm: false, // There are no fixed term Digital subscription rate plans
	});

	const oldNonStandardPaymentFields = getOldNonStandardPaymentFields(
		paymentMethod,
		mandateId,
	);

	const productFields = {
		subscription_details: nonDeliveryEmailFields.subscription_rate, // Duplicate, to be removed in a future PR
		date_of_first_payment: nonDeliveryEmailFields.first_payment_date, // Duplicate, to be removed in a future PR
		country: getCountryNameByIsoCode(user.billingAddress.country) ?? '',
		trial_period: '14',
		zuorasubscriberid: subscriptionNumber, // Duplicate, to be removed in a future PR
		...oldNonStandardPaymentFields,
		...nonDeliveryEmailFields,
	};
	return buildThankYouEmailFields(user, 'digipack', productFields);
}
