import {
	createGiftBuyerContactRecordRequest,
	createGiftRecipientContactRecordRequest,
	createPrintContactRecordRequest,
	SalesforceError,
	salesforceErrorCodes,
	SalesforceService,
} from '../services/salesforce';
import {
	giftBuyer,
	giftRecipient,
	printSubscriber,
	street,
} from './fixtures/salesforceFixtures';

describe('SalesforceService', () => {
	test('createPrintContactRecordRequest should have properties populated correctly', () => {
		const newContact = createPrintContactRecordRequest(printSubscriber);

		expect(newContact.MailingStreet).toBe(street);
		expect(newContact.MailingCity).toBe(printSubscriber.deliveryAddress.city);
		expect(newContact.MailingState).toBe(printSubscriber.deliveryAddress.state);
		expect(newContact.MailingPostalCode).toBe(
			printSubscriber.deliveryAddress.postCode,
		);
		expect(newContact.MailingCountry).toBe('United Kingdom');

		expect(newContact.OtherStreet).toBe(street);
		expect(newContact.OtherCity).toBe(printSubscriber.billingAddress.city);
		expect(newContact.OtherState).toBe(printSubscriber.billingAddress.state);
		expect(newContact.OtherPostalCode).toBe(
			printSubscriber.billingAddress.postCode,
		);
		expect(newContact.OtherCountry).toBe('United Kingdom');

		expect(newContact.Email).toBe(printSubscriber.primaryEmailAddress);
		expect(newContact.FirstName).toBe(printSubscriber.firstName);
		expect(newContact.LastName).toBe(printSubscriber.lastName);
		expect(newContact.Salutation).toBe(printSubscriber.title);
		expect(newContact.Phone).toBe(printSubscriber.telephoneNumber);
	});

	test('createGiftBuyerContactRecordRequest should have properties populated correctly', () => {
		const newContact = createGiftBuyerContactRecordRequest(giftBuyer);

		expect('MailingStreet' in newContact).toBe(false);
		expect('MailingCity' in newContact).toBe(false);
		expect('MailingState' in newContact).toBe(false);
		expect('MailingPostalCode' in newContact).toBe(false);
		expect('MailingCountry' in newContact).toBe(false);

		expect(newContact.OtherStreet).toBe(street);
		expect(newContact.OtherCity).toBe(giftBuyer.billingAddress.city);
		expect(newContact.OtherState).toBe(giftBuyer.billingAddress.state);
		expect(newContact.OtherPostalCode).toBe(giftBuyer.billingAddress.postCode);
		expect(newContact.OtherCountry).toBe('United Kingdom');

		expect(newContact.Email).toBe(giftBuyer.primaryEmailAddress);
		expect(newContact.FirstName).toBe(giftBuyer.firstName);
		expect(newContact.LastName).toBe(giftBuyer.lastName);
		expect(newContact.Salutation).toBe(giftBuyer.title);
		expect(newContact.Phone).toBe(giftBuyer.telephoneNumber);
	});

	test('createGiftRecipientContactRecordRequest should have properties populated correctly', () => {
		const buyerContactRecord = {
			Id: '003UD00000kdJ6kYAE',
			AccountId: '001UD00000NP6BTYA1',
		};

		const recipientContact = createGiftRecipientContactRecordRequest(
			buyerContactRecord,
			giftRecipient,
			giftBuyer,
		);

		expect('OtherStreet' in recipientContact).toBe(false);
		expect('OtherCity' in recipientContact).toBe(false);
		expect('OtherState' in recipientContact).toBe(false);
		expect('OtherPostalCode' in recipientContact).toBe(false);
		expect('OtherCountry' in recipientContact).toBe(false);

		expect(recipientContact.MailingStreet).toBe(street);
		expect(recipientContact.MailingCity).toBe(giftBuyer.deliveryAddress.city);
		expect(recipientContact.MailingState).toBe(giftBuyer.deliveryAddress.state);
		expect(recipientContact.MailingPostalCode).toBe(
			giftBuyer.deliveryAddress.postCode,
		);
		expect(recipientContact.MailingCountry).toBe('United Kingdom');

		expect(recipientContact.Email).toBe(giftRecipient.email);
		expect(recipientContact.FirstName).toBe(giftRecipient.firstName);
		expect(recipientContact.LastName).toBe(giftRecipient.lastName);
		expect(recipientContact.Salutation).toBe(giftRecipient.title);
		expect(recipientContact.AccountId).toBe(buyerContactRecord.AccountId);
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
