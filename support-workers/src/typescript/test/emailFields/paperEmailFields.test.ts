import { DataExtensionNames } from '@modules/email/email';
import dayjs from 'dayjs';
import { buildPaperEmailFields } from '../../emailFields/paperEmailFields';
import {
	deliveryAgentDetails,
	deliveryContact,
	directDebitPaymentMethod,
	emailAddress,
	emailUser,
	mandateId,
	paperPaymentSchedule,
	subscriptionNumber,
} from '../fixtures/emailFields/emailFieldsTestData';

describe('Paper email fields', () => {
	const today = dayjs('2025-11-11');
	const expected = {
		To: {
			Address: emailAddress,
			ContactAttributes: {
				SubscriberAttributes: {
					subscription_rate: '£10.00 every month',
					date_of_first_paper: 'Tuesday, 18 November 2025',
					subscriber_id: subscriptionNumber,
					delivery_address_line_1: '90 York Way',
					delivery_address_line_2: '',
					delivery_address_town: 'London',
					delivery_country: 'United Kingdom',
					delivery_postcode: deliveryContact.postalCode,
					payment_method: 'Direct Debit',
					first_name: deliveryContact.firstName,
					last_name: deliveryContact.lastName,
					account_holder: 'Mickey Mouse',
					EmailAddress: emailAddress,
					ZuoraSubscriberId: subscriptionNumber,
					package: 'Everyday',
					date_of_first_payment: 'Tuesday, 18 November 2025',
					bank_sort_code: '20-20-20',
					mandate_id: mandateId,
					bank_account_no: '******11',
				},
			},
		},
		DataExtensionName: DataExtensionNames.homeDeliveryDay0Email,
		IdentityUserId: '1234',
	};
	const expectedDeliveryAgentFields = {
		delivery_agent_email: deliveryAgentDetails.email,
		delivery_agent_telephone: deliveryAgentDetails.telephone,
		delivery_agent_name: deliveryAgentDetails.agentname,
		delivery_agent_address1: deliveryAgentDetails.address1,
		delivery_agent_address2: deliveryAgentDetails.address2,
		delivery_agent_town: deliveryAgentDetails.town,
		delivery_agent_county: deliveryAgentDetails.county,
		delivery_agent_postcode: deliveryAgentDetails.postcode,
	};
	it('should build correct email fields for HomeDelivery Everyday sub with DD', () => {
		const emailFields = buildPaperEmailFields({
			user: emailUser,
			currency: 'GBP',
			subscriptionNumber: subscriptionNumber,
			paymentSchedule: paperPaymentSchedule,
			paymentMethod: directDebitPaymentMethod,
			mandateId: mandateId,
			productInformation: {
				product: 'HomeDelivery',
				ratePlan: 'Everyday',
				firstDeliveryDate: today.add(7, 'day').toDate(),
				deliveryInstructions: '',
				deliveryContact: deliveryContact,
			},
		});

		expect(emailFields).toStrictEqual(expected);
	});
	it('should build correct email fields for NationalDelivery Everyday sub with DD and delivery agent details', () => {
		const emailFields = buildPaperEmailFields({
			user: emailUser,
			currency: 'GBP',
			subscriptionNumber: subscriptionNumber,
			paymentSchedule: paperPaymentSchedule,
			paymentMethod: directDebitPaymentMethod,
			mandateId: mandateId,
			productInformation: {
				product: 'NationalDelivery',
				ratePlan: 'Everyday',
				firstDeliveryDate: today.add(7, 'day').toDate(),
				deliveryInstructions: '',
				deliveryContact: deliveryContact,
				deliveryAgent: 123,
			},
			deliveryAgentDetails: deliveryAgentDetails,
		});

		expect(emailFields.To.ContactAttributes.SubscriberAttributes).toMatchObject(
			{
				...expected.To.ContactAttributes.SubscriberAttributes,
				...expectedDeliveryAgentFields,
			},
		);
		expect(emailFields.DataExtensionName).toBe(
			DataExtensionNames.nationalDeliveryDay0Email,
		);
		expect(emailFields.IdentityUserId).toBe(expected.IdentityUserId);
	});
});
