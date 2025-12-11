import { BillingPeriod } from '@modules/product/billingPeriod';
import dayjs from 'dayjs';
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
		const today = dayjs('2025-10-26');
		const emailFields = buildDigitalSubscriptionEmailFields({
			today: today,
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
						subscriber_id: subscriptionNumber,
						subscription_rate: '£119.90 for the first year',
						payment_method: 'Direct Debit',
						first_payment_date: 'Tuesday, 11 November 2025',
						account_holder: 'Mickey Mouse',
						bank_account_no: '******11',
						bank_sort_code: '20-20-20',
						mandate_id: 'MANDATE_ID',
					},
				},
			},
			DataExtensionName: 'digipack',
			IdentityUserId: '1234',
		};
		expect(emailFields).toStrictEqual(expected);
	});
});
