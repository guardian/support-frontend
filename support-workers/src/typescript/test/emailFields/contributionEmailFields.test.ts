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
		const now = dayjs('2025-11-11');
		const emailFields = buildContributionEmailFields({
			now: now,
			user: emailUser,
			amount: 5,
			currency: 'GBP',
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
					},
				},
			},
			DataExtensionName: 'regular-contribution-thank-you',
			IdentityUserId: '1234',
		};
		expect(emailFields).toStrictEqual(expected);
	});
});
