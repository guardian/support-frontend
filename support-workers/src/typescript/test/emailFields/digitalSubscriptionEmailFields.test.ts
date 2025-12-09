import { BillingPeriod } from '@modules/product/billingPeriod';
import { buildDigitalSubscriptionEmailFields } from '../../emailFields/digitalSubscriptionEmailFields';
import {
	directDebitPaymentMethod,
	emailAddress,
	emailUser,
	mandateId,
	subscriptionNumber,
} from '../fixtures/emailFields/emailFieldsTestData';

describe('digitalSubscriptionEmailFields', () => {
	test('should build the correct email fields for digital subscription thank you email', () => {
		const emailFields = buildDigitalSubscriptionEmailFields({
			user: emailUser,
			currency: 'GBP',
			billingPeriod: BillingPeriod.Annual,
			subscriptionNumber: subscriptionNumber,
			paymentSchedule: {
				payments: [{ date: new Date('2025-11-11'), amount: 119.9 }],
			},
			paymentMethod: directDebitPaymentMethod,
			mandateId: mandateId,
		});
		const expected = {
			To: {
				Address: emailAddress,
				ContactAttributes: {
					SubscriberAttributes: {
						first_name: emailUser.firstName,
						last_name: emailUser.lastName,
						mandateid: mandateId,
						subscription_details: '£119.90 for the first year',
						date_of_first_payment: 'Tuesday, 11 November 2025',
						country: 'United Kingdom',
						trial_period: '14',
						zuorasubscriberid: subscriptionNumber,
						account_name: directDebitPaymentMethod.BankTransferAccountName,
						account_number: directDebitPaymentMethod.BankTransferAccountNumber,
						sort_code: directDebitPaymentMethod.BankCode,
						default_payment_method: 'Direct Debit',
					},
				},
			},
			DataExtensionName: 'digipack',
			IdentityUserId: '1234',
		};
		expect(emailFields).toStrictEqual(expected);
	});
});
