import { BillingPeriod } from '@modules/product/billingPeriod';
import dayjs from 'dayjs';
import { buildSupporterPlusThankYouEmailFields } from '../../emailFields/supporterPlusEmailFields';
import {
	creditCardPaymentMethod,
	directDebitPaymentMethod,
	emailAddress,
	emailUser,
	fixedTermPaymentSchedule,
	paymentSchedule,
	subscriptionNumber,
	today,
} from '../fixtures/emailFields/emailFieldsTestData';

describe('Supporter plus thank you email fields', () => {
	it('should build correct email fields for monthly supporter plus with DD', () => {
		const emailFields = buildSupporterPlusThankYouEmailFields({
			now: dayjs(today),
			user: emailUser,
			currency: 'GBP',
			billingPeriod: BillingPeriod.Monthly,
			subscriptionNumber: subscriptionNumber,
			paymentSchedule: paymentSchedule,
			paymentMethod: directDebitPaymentMethod,
			isFixedTerm: false,
			mandateId: '65HK26E',
		});

		const expected = {
			To: {
				Address: emailAddress,
				ContactAttributes: {
					SubscriberAttributes: {
						first_name: emailUser.firstName,
						email_address: emailAddress,
						'account name': directDebitPaymentMethod.BankTransferAccountName,
						'Mandate ID': '65HK26E',
						'sort code': directDebitPaymentMethod.BankCode,
						'payment method': 'Direct Debit',
						'first payment date': 'Friday, 21 November 2025',
						subscription_details:
							'£10.00 for the first month, then £12.00 every month',
						zuorasubscriberid: subscriptionNumber,
						last_name: emailUser.lastName,
						currency: 'GBP',
						billing_period: 'monthly',
						'account number': '******11',
						created: today,
						is_fixed_term: 'false',
						product: 'monthly-supporter-plus',
					},
				},
			},
			DataExtensionName: 'supporter-plus',
			IdentityUserId: '1234',
		};

		expect(emailFields).toStrictEqual(expected);
	});
	test('should build correct email fields for annual supporter plus with credit card', () => {
		const emailFields = buildSupporterPlusThankYouEmailFields({
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
						email_address: emailAddress,
						'payment method': 'credit / debit card',
						'first payment date': 'Tuesday, 11 November 2025',
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
			DataExtensionName: 'supporter-plus',
			IdentityUserId: '1234',
		};
		expect(emailFields).toStrictEqual(expected);
	});

	test('should build correct email fields for fixed term subscription', () => {
		const emailFields = buildSupporterPlusThankYouEmailFields({
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
						email_address: emailAddress,
						'account name': 'Mickey Mouse',
						'Mandate ID': '65HK26E',
						'sort code': '20-20-20',
						'payment method': 'Direct Debit',
						'first payment date': 'Friday, 21 November 2025',
						subscription_details: '£9.00 for 12 months',
						zuorasubscriberid: subscriptionNumber,
						last_name: 'Mouse',
						currency: 'GBP',
						billing_period: 'annual',
						'account number': '******11',
						created: today,
						is_fixed_term: 'true',
						product: 'annual-supporter-plus',
					},
				},
			},
			DataExtensionName: 'supporter-plus',
			IdentityUserId: '1234',
		};
		expect(emailFields).toStrictEqual(expected);
	});
});
