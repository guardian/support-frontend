import { DataExtensionNames } from '@modules/email/email';
import { BillingPeriod } from '@modules/product/billingPeriod';
import dayjs from 'dayjs';
import { formatDate } from '../../emailFields/emailFields';
import { buildGuardianWeeklyEmailFields } from '../../emailFields/guardianWeeklyEmailFields';
import type { GiftRecipient } from '../../model/stateSchemas';
import {
	creditCardPaymentMethod,
	deliveryContact,
	emailAddress,
	emailUser,
	paperPaymentSchedule,
	subscriptionNumber,
} from '../fixtures/emailFields/emailFieldsTestData';

describe('Guardian weekly thank you email fields', () => {
	it('should build correct email fields for monthly domestic', () => {
		const today = dayjs('2025-11-11');
		const firstDeliveryDate = today.add(7, 'day');
		const emailFields = buildGuardianWeeklyEmailFields({
			user: emailUser,
			currency: 'GBP',
			billingPeriod: BillingPeriod.Monthly,
			subscriptionNumber: subscriptionNumber,
			paymentSchedule: paperPaymentSchedule,
			paymentMethod: creditCardPaymentMethod,
			mandateId: undefined,
			productInformation: {
				product: 'GuardianWeeklyDomestic',
				ratePlan: 'Monthly',
				firstDeliveryDate: firstDeliveryDate.toDate(),
				deliveryContact: deliveryContact,
			},
		});

		const expected = {
			To: {
				Address: emailAddress,
				ContactAttributes: {
					SubscriberAttributes: {
						first_name: emailUser.firstName,
						ZuoraSubscriberId: subscriptionNumber,
						payment_method: 'Credit/Debit Card',
						delivery_address_line_1: emailUser.billingAddress.lineOne,
						delivery_address_line_2: '',
						delivery_address_town: emailUser.billingAddress.city,
						delivery_postcode: emailUser.billingAddress.postCode,
						delivery_country: 'United Kingdom',
						date_of_second_payment: 'Thursday, 18 December 2025',
						subscription_rate: '£10.00 every month',
						date_of_first_paper: formatDate(firstDeliveryDate),
						date_of_first_payment: formatDate(firstDeliveryDate),
						subscriber_id: subscriptionNumber,
						last_name: emailUser.lastName,
					},
				},
			},
			DataExtensionName: DataExtensionNames.guardianWeeklyDay0Email,
			IdentityUserId: '1234',
		};

		expect(emailFields).toStrictEqual(expected);
	});
	test('should build correct email fields for GW gift', () => {
		const today = dayjs('2025-11-11');
		const firstDeliveryDate = today.add(7, 'day');
		const giftRecipient: GiftRecipient = {
			firstName: 'Gift',
			lastName: 'Recipient',
			email: emailAddress,
			title: 'Mrs',
		};
		const emailFields = buildGuardianWeeklyEmailFields({
			user: emailUser,
			currency: 'USD',
			billingPeriod: BillingPeriod.Annual,
			subscriptionNumber: subscriptionNumber,
			paymentSchedule: paperPaymentSchedule,
			paymentMethod: creditCardPaymentMethod,
			mandateId: undefined,
			productInformation: {
				product: 'GuardianWeeklyRestOfWorld',
				ratePlan: 'Annual',
				firstDeliveryDate: firstDeliveryDate.toDate(),
				deliveryContact: deliveryContact,
			},
			giftRecipient: giftRecipient,
		});
		const expected = {
			To: {
				Address: emailAddress,
				ContactAttributes: {
					SubscriberAttributes: {
						first_name: emailUser.firstName,
						ZuoraSubscriberId: subscriptionNumber,
						payment_method: 'Credit/Debit Card',
						delivery_address_line_1: emailUser.billingAddress.lineOne,
						delivery_address_line_2: '',
						delivery_address_town: emailUser.billingAddress.city,
						delivery_postcode: emailUser.billingAddress.postCode,
						delivery_country: 'United Kingdom',
						giftee_first_name: 'Gift',
						giftee_last_name: 'Recipient',
						date_of_second_payment: 'Thursday, 18 December 2025',
						subscription_rate: '$10.00 every year',
						date_of_first_paper: formatDate(firstDeliveryDate),
						date_of_first_payment: formatDate(firstDeliveryDate),
						subscriber_id: subscriptionNumber,
						last_name: emailUser.lastName,
					},
				},
			},
			DataExtensionName: DataExtensionNames.guardianWeeklyDay0Email,
			IdentityUserId: '1234',
		};

		expect(emailFields).toStrictEqual(expected);
	});
});
