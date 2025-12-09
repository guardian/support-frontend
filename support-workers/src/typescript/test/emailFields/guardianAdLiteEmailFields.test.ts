import { DataExtensionNames } from '@modules/email/email';
import { buildGuardianAdLiteEmailFields } from '../../emailFields/guardianAdLiteEmailFields';
import {
	creditCardPaymentMethod,
	emailAddress,
	emailUser,
	subscriptionNumber,
} from '../fixtures/emailFields/emailFieldsTestData';

describe('guardianAdLiteEmailFields', () => {
	test('should build the correct email fields for Guardian Ad-Lite', () => {
		const emailFields = buildGuardianAdLiteEmailFields({
			user: emailUser,
			currency: 'GBP',
			subscriptionNumber: subscriptionNumber,
			paymentSchedule: {
				payments: [
					{ date: new Date('2025-11-11'), amount: 10 },
					{ date: new Date('2025-12-11'), amount: 10 },
				],
			},
			paymentMethod: creditCardPaymentMethod,
		});
		const expected = {
			To: {
				Address: emailAddress,
				ContactAttributes: {
					SubscriberAttributes: {
						billing_period: 'monthly',
						subscription_details: '£10.00 every month',
						first_payment_date: 'Tuesday, 11 November 2025',
						zuorasubscriberid: subscriptionNumber,
						payment_method: 'credit / debit card',
					},
				},
			},
			DataExtensionName: DataExtensionNames.guardianAdLiteDay0Email,
			IdentityUserId: '1234',
		};
		expect(emailFields).toStrictEqual(expected);
	});
});
