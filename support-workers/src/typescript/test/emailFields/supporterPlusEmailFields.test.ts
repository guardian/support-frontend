import { DataExtensionNames } from '@modules/email/email';
import { BillingPeriod } from '@modules/product/billingPeriod';
import dayjs from 'dayjs';
import { buildSupporterPlusEmailFields } from '../../emailFields/supporterPlusEmailFields';
import {
	creditCardPaymentMethod,
	directDebitPaymentMethod,
	emailAddress,
	emailUser,
	fixedTermPaymentSchedule,
	mandateId,
	paymentSchedule,
	subscriptionNumber,
	today,
} from '../fixtures/emailFields/emailFieldsTestData';

describe('Supporter plus thank you email fields', () => {
	it('should build correct email fields for monthly supporter plus with DD', () => {
		const emailFields = buildSupporterPlusEmailFields({
			now: dayjs(today),
			user: emailUser,
			currency: 'GBP',
			billingPeriod: BillingPeriod.Monthly,
			subscriptionNumber: subscriptionNumber,
			paymentSchedule: paymentSchedule,
			paymentMethod: directDebitPaymentMethod,
			isFixedTerm: false,
			mandateId: mandateId,
		});

		const expected = {
			To: {
				Address: emailAddress,
				ContactAttributes: {
					SubscriberAttributes: {
						first_name: emailUser.firstName,
						account_name: directDebitPaymentMethod.BankTransferAccountName,
						Mandate_ID: mandateId,
						sort_code: directDebitPaymentMethod.BankCode,
						payment_method: 'Direct Debit',
						first_payment_date: 'Friday, 21 November 2025',
						subscription_details:
							'£10.00 for the first month, then £12.00 every month',
						zuorasubscriberid: subscriptionNumber,
						last_name: emailUser.lastName,
						currency: 'GBP',
						billing_period: 'monthly',
						account_number: '******11',
						created: today,
						is_fixed_term: 'false',
						product: 'monthly-supporter-plus',
					},
				},
			},
			DataExtensionName: DataExtensionNames.supporterPlusDay0Email,
			IdentityUserId: '1234',
		};

		expect(emailFields).toStrictEqual(expected);
	});
	test('should build correct email fields for annual supporter plus with credit card', () => {
		const emailFields = buildSupporterPlusEmailFields({
			now: dayjs(today),
			user: emailUser,
			currency: 'GBP',
			billingPeriod: BillingPeriod.Annual,
			subscriptionNumber: subscriptionNumber,
			paymentSchedule: paymentSchedule,
			paymentMethod: creditCardPaymentMethod,
			isFixedTerm: false,
		});
		const expected = {
			To: {
				Address: emailAddress,
				ContactAttributes: {
					SubscriberAttributes: {
						first_name: 'Mickey',
						payment_method: 'credit / debit card',
						first_payment_date: 'Tuesday, 11 November 2025',
						subscription_details:
							'£10.00 for the first year, then £12.00 every year',
						zuorasubscriberid: subscriptionNumber,
						last_name: 'Mouse',
						currency: 'GBP',
						billing_period: 'annual',
						created: today,
						is_fixed_term: 'false',
						product: 'annual-supporter-plus',
					},
				},
			},
			DataExtensionName: DataExtensionNames.supporterPlusDay0Email,
			IdentityUserId: '1234',
		};
		expect(emailFields).toStrictEqual(expected);
	});

	test('should build correct email fields for fixed term subscription', () => {
		const emailFields = buildSupporterPlusEmailFields({
			now: dayjs(today),
			user: emailUser,
			currency: 'GBP',
			billingPeriod: BillingPeriod.Annual,
			subscriptionNumber: subscriptionNumber,
			paymentSchedule: fixedTermPaymentSchedule,
			paymentMethod: directDebitPaymentMethod,
			isFixedTerm: true,
			mandateId: '65HK26E',
		});

		const expected = {
			To: {
				Address: emailAddress,
				ContactAttributes: {
					SubscriberAttributes: {
						first_name: 'Mickey',
						account_name: 'Mickey Mouse',
						Mandate_ID: '65HK26E',
						sort_code: '20-20-20',
						payment_method: 'Direct Debit',
						first_payment_date: 'Friday, 21 November 2025',
						subscription_details: '£9.00 for 12 months',
						zuorasubscriberid: subscriptionNumber,
						last_name: 'Mouse',
						currency: 'GBP',
						billing_period: 'annual',
						account_number: '******11',
						created: today,
						is_fixed_term: 'true',
						product: 'annual-supporter-plus',
					},
				},
			},
			DataExtensionName: DataExtensionNames.supporterPlusDay0Email,
			IdentityUserId: '1234',
		};
		expect(emailFields).toStrictEqual(expected);
	});
});
