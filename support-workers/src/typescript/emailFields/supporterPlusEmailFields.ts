import type { IsoCurrency } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { zuoraDateFormat } from '@modules/zuora/utils/common';
import type { Dayjs } from 'dayjs';
import type dayjs from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { PaymentSchedule } from '../model/paymentSchedule';
import type { User } from '../model/stateSchemas';
import { getIfDefined } from '../util/nullAndUndefined';
import { describe } from './emailFieldDescription';
import { buildThankYouEmailFields, formatDate } from './emailFields';

function getPaymentMethodFields(
	paymentMethod: PaymentMethod,
	created: Dayjs,
	mandateId?: string,
) {
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

export function buildSupporterPlusThankYouEmailFields({
	now,
	user,
	currency,
	billingPeriod,
	subscriptionNumber,
	paymentSchedule,
	paymentMethod,
	isFixedTerm,
	mandateId,
}: {
	now: dayjs.Dayjs;
	user: User;
	currency: IsoCurrency;
	billingPeriod: BillingPeriod;
	subscriptionNumber: string;
	paymentSchedule: PaymentSchedule;
	paymentMethod: PaymentMethod;
	isFixedTerm: boolean;
	mandateId?: string;
}) {
	const paymentMethodFields = getPaymentMethodFields(
		paymentMethod,
		now,
		mandateId,
	);
	const productFields = {
		email_address: user.primaryEmailAddress,
		created: zuoraDateFormat(now),
		currency: currency,
		first_name: user.firstName,
		last_name: user.lastName,
		billing_period: billingPeriod.toLowerCase(),
		product: `${billingPeriod.toLowerCase()}-supporter-plus`,
		zuorasubscriberid: subscriptionNumber,
		subscription_details: describe(
			paymentSchedule,
			billingPeriod,
			currency,
			isFixedTerm,
		),
		is_fixed_term: isFixedTerm.toString(),
		...paymentMethodFields,
	};
	return buildThankYouEmailFields(user, 'supporter-plus', productFields);
}
