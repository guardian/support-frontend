import { BillingPeriod } from '@modules/product/billingPeriod';
import dayjs from 'dayjs';
import { buildContributionEmailFields } from '../../emailFields/contributionEmailFields';
import {
	directDebitPaymentMethod,
	emailAddress,
	emailUser,
	mandateId,
} from '../fixtures/emailFields/emailFieldsTestData';

describe('contributionEmailFields', () => {
	test('should build the correct email fields for recurring contribution thank you email', () => {
		const today = dayjs('2025-11-11');
		const emailFields = buildContributionEmailFields({
			today: today,
			user: emailUser,
			amount: 5,
			currency: 'GBP',
			billingPeriod: BillingPeriod.Monthly,
			subscriptionNumber: 'SUBSCRIPTION123',
			paymentSchedule: {
				payments: [
					{ date: new Date('2025-11-21'), amount: 5 },
					{ date: new Date('2025-12-21'), amount: 5 },
				],
			},
			paymentMethod: directDebitPaymentMethod,
			mandateId: mandateId,
			ratePlan: 'Monthly',
		});
		const expected = {
			To: {
				Address: emailAddress,
				ContactAttributes: {
					SubscriberAttributes: {
						name: emailUser.firstName,
						amount: '5',
						currency: 'GBP',
						edition: emailUser.billingAddress.country,
						Mandate_ID: mandateId,
						first_payment_date: 'Friday, 21 November 2025',
						product: 'monthly-contribution',
						created: '2025-11-11T00:00:00.000Z',
						account_name: directDebitPaymentMethod.BankTransferAccountName,
						account_number: '******11',
						sort_code: directDebitPaymentMethod.BankCode,
						payment_method: 'Direct Debit',
						first_name: emailUser.firstName,
						account_holder: 'Mickey Mouse',
						bank_account_no: '******11',
						bank_sort_code: '20-20-20',
						last_name: 'Mouse',
						mandate_id: 'MANDATE_ID',
						subscriber_id: 'SUBSCRIPTION123',
						subscription_rate: '£5.00 every month',
					},
				},
			},
			DataExtensionName: 'regular-contribution-thank-you',
			IdentityUserId: '1234',
		};
		expect(emailFields).toStrictEqual(expected);
	});
});
