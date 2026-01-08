import { DataExtensionNames } from '@modules/email/email';
import { BillingPeriod } from '@modules/product/billingPeriod';
import dayjs from 'dayjs';
import { formatDate } from '../../emailFields/paymentEmailFields';
import { buildTierThreeEmailFields } from '../../emailFields/tierThreeEmailFields';
import {
	creditCardPaymentMethod,
	emailAddress,
	emailUser,
	paperPaymentSchedule,
	subscriptionNumber,
} from '../fixtures/emailFields/emailFieldsTestData';

describe('Tier three thank you email fields', () => {
	it('should build correct email fields for monthly tier three', () => {
		const today = dayjs('2025-11-11');
		const firstDeliveryDate = today.add(7, 'day');
		const emailFields = buildTierThreeEmailFields({
			today: today,
			user: emailUser,
			currency: 'GBP',
			billingPeriod: BillingPeriod.Monthly,
			subscriptionNumber: subscriptionNumber,
			paymentSchedule: paperPaymentSchedule,
			paymentMethod: creditCardPaymentMethod,
			mandateId: undefined,
		});

		const expected = {
			To: {
				Address: emailAddress,
				ContactAttributes: {
					SubscriberAttributes: {
						first_payment_date: formatDate(firstDeliveryDate),
						first_name: emailUser.firstName,
						payment_method: 'Credit/Debit Card',
						billing_period: 'monthly',
						delivery_address_line_1: emailUser.billingAddress.lineOne,
						delivery_address_line_2: '',
						delivery_address_town: emailUser.billingAddress.city,
						delivery_postcode: emailUser.billingAddress.postCode,
						delivery_country: 'United Kingdom',
						subscription_rate: '£10.00 every month',
						subscriber_id: subscriptionNumber,
						last_name: emailUser.lastName, // Not used
					},
				},
			},
			DataExtensionName: DataExtensionNames.tierThreeDay0Email,
			IdentityUserId: '1234',
		};

		expect(emailFields).toStrictEqual(expected);
	});
});
