import {
	createContactRecordRequest,
	SalesforceError,
	salesforceErrorCodes,
	SalesforceService,
} from '../services/salesforce';
import { emailAddress, street, user } from './fixtures/salesforceFixtures';

describe('SalesforceService', () => {
	test('createContactRecordRequest should only include delivery fields for purchases without a gift recipient', () => {
		const newContactNoGift = createContactRecordRequest(user, null);
		expect(newContactNoGift.MailingStreet).toBe(street);

		const newContactWithGift = createContactRecordRequest(user, {
			email: emailAddress,
			title: 'Ms',
			firstName: 'Jane',
			lastName: 'Doe',
		});
		expect('MailingStreet' in newContactWithGift).toBe(false);
		expect('MailingCity' in newContactWithGift).toBe(false);
		expect('MailingState' in newContactWithGift).toBe(false);
		expect('MailingPostalCode' in newContactWithGift).toBe(false);
		expect('MailingCountry' in newContactWithGift).toBe(false);
	});

	test('createContactRecordRequest should not include delivery fields for purchases when user delivery address is undefined', () => {
		const userWithoutDeliveryAddress = {
			...user,
			deliveryAddress: undefined,
		};
		const newContact = createContactRecordRequest(
			userWithoutDeliveryAddress,
			null,
		);
		expect('MailingStreet' in newContact).toBe(false);
		expect('MailingCity' in newContact).toBe(false);
		expect('MailingState' in newContact).toBe(false);
		expect('MailingPostalCode' in newContact).toBe(false);
		expect('MailingCountry' in newContact).toBe(false);
	});

	test('createContactRecordRequest should include delivery fields for purchases when user delivery address is populated and there is no giftRecipient', () => {
		const newContact = createContactRecordRequest(user, null);
		expect(newContact.MailingStreet).toBe(street);
		expect(newContact.MailingCity).toBe(user.deliveryAddress.city);
		expect(newContact.MailingState).toBe(user.deliveryAddress.state);
		expect(newContact.MailingPostalCode).toBe(user.deliveryAddress.postCode);
		expect(newContact.MailingCountry).toBe(user.deliveryAddress.country);
	});

	test('it should throw an INSERT_UPDATE_DELETE_NOT_ALLOWED_DURING_MAINTENANCE error when appropriate', () => {
		const errorString =
			'Failed Upsert of new Contact: Upsert failed. First exception on row 0; first error: INSERT_UPDATE_DELETE_NOT_ALLOWED_DURING_MAINTENANCE, Updates can’t be made during maintenance. Try again when maintenance is complete: []';

		expect(() =>
			SalesforceService.parseResponseToResult({
				Success: false,
				ErrorString: errorString,
			}),
		).toThrow(
			new SalesforceError({
				errorCode: salesforceErrorCodes.readOnlyMaintenance,
				message: errorString,
			}),
		);
	});
	test('it should throw an UNKNOWN_ERROR error for all other exceptions', () => {
		const errorString = 'Things have gone awry';

		expect(() =>
			SalesforceService.parseResponseToResult({
				Success: false,
				ErrorString: errorString,
			}),
		).toThrow(
			new SalesforceError({
				errorCode: 'UNKNOWN_ERROR',
				message: errorString,
			}),
		);
	});
});
