import { DataExtensionNames } from '@modules/email/email';
import { BillingPeriod } from '@modules/product/billingPeriod';
import dayjs from 'dayjs';
import { formatDate } from '../../emailFields/emailFields';
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
			firstDeliveryDate: firstDeliveryDate,
		});

		const expected = {
			To: {
				Address: emailAddress,
				ContactAttributes: {
					SubscriberAttributes: {
						first_payment_date: formatDate(firstDeliveryDate),
						first_name: emailUser.firstName,
						ZuoraSubscriberId: subscriptionNumber,
						subscription_details: '£10.00 every month',
						payment_method: 'Credit/Debit Card',
						billing_period: 'monthly',
						delivery_address_line_1: emailUser.billingAddress.lineOne,
						delivery_address_line_2: '',
						delivery_address_town: emailUser.billingAddress.city,
						delivery_postcode: emailUser.billingAddress.postCode,
						delivery_country: 'United Kingdom',
						subscription_rate: '£10.00 every month', // Not used duplicate
						date_of_first_paper: formatDate(firstDeliveryDate), // Not used
						date_of_first_payment: formatDate(firstDeliveryDate), // Not used it's added by buildDeliveryEmailFields
						subscriber_id: subscriptionNumber, // Not used duplicate
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
