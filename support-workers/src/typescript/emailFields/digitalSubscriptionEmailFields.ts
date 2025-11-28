import type { EmailMessageWithIdentityUserId } from '@modules/email/email';
import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import dayjs from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { User } from '../model/stateSchemas';
import { getIfDefined } from '../util/nullAndUndefined';
import { buildThankYouEmailFields, formatDate } from './emailFields';
import { describePayments, firstPayment } from './paymentDescription';

function getPaymentMethodFields(
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
			return {
				default_payment_method: 'PayPal',
			};
	}
}
export function buildDigitalSubscriptionEmailFields({
	user,
	currency,
	billingPeriod,
	subscriptionNumber,
	paymentSchedule,
	paymentMethod,
	mandateId,
}: {
	user: User;
	currency: IsoCurrency;
	billingPeriod: BillingPeriod;
	subscriptionNumber: string;
	paymentSchedule: PaymentSchedule;
	paymentMethod: PaymentMethod;
	mandateId?: string;
}): EmailMessageWithIdentityUserId {
	const paymentMethodFields = getPaymentMethodFields(paymentMethod, mandateId);
	const productFields = {
		first_name: user.firstName,
		last_name: user.lastName,
		emailaddress: user.primaryEmailAddress,
		subscription_details: describePayments(
			paymentSchedule,
			billingPeriod,
			currency,
			false,
		),
		date_of_first_payment: formatDate(
			dayjs(firstPayment(paymentSchedule).date),
		),
		country: getCountryNameByIsoCode(user.billingAddress.country) ?? '',
		trial_period: '14',
		zuorasubscriberid: subscriptionNumber,
		...paymentMethodFields,
	};
	return buildThankYouEmailFields(user, 'digipack', productFields);
}
