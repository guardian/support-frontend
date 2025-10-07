import type { Title } from '../model/stateSchemas';
import {
	buyerTypeIsPrint,
	createBillingAddressFields,
	createDigitalOnlyContactRecordRequest,
	createGiftBuyerContactRecordRequest,
	createGiftRecipientContactRecordRequest,
	createMailingAddressFields,
	createPrintContactRecordRequest,
	salesforceDeliveryOrRecipientRecordTypeId,
	SalesforceError,
	salesforceErrorCodes,
	SalesforceService,
	validGiftRecipientFields,
} from '../services/salesforce';
import {
	buyerStreet,
	digitalOnlySubscriber,
	giftBuyer,
	giftRecipient,
	printSubscriber,
	recipientStreet,
} from './fixtures/salesforce/unitTests';

describe('SalesforceService', () => {
	test('createPrintContactRecordRequest should have properties populated correctly', () => {
		const newContact = createPrintContactRecordRequest(printSubscriber);

		expect(newContact.MailingStreet).toBe(buyerStreet);
		expect(newContact.MailingCity).toBe(printSubscriber.deliveryAddress.city);
		expect(newContact.MailingState).toBe(printSubscriber.deliveryAddress.state);
		expect(newContact.MailingPostalCode).toBe(
			printSubscriber.deliveryAddress.postCode,
		);
		expect(newContact.MailingCountry).toBe('United Kingdom');

		expect(newContact.OtherStreet).toBe(buyerStreet);
		expect(newContact.OtherCity).toBe(printSubscriber.billingAddress.city);
		expect(newContact.OtherState).toBe(printSubscriber.billingAddress.state);
		expect(newContact.OtherPostalCode).toBe(
			printSubscriber.billingAddress.postCode,
		);
		expect('Salutation' in newContact).toBe(false);
		expect(newContact.OtherCountry).toBe('United Kingdom');

		expect(newContact.Email).toBe(printSubscriber.primaryEmailAddress);
		expect(newContact.FirstName).toBe(printSubscriber.firstName);
		expect(newContact.LastName).toBe(printSubscriber.lastName);
	});

	test('createGiftBuyerContactRecordRequest should have properties populated correctly', () => {
		const newContact = createGiftBuyerContactRecordRequest(giftBuyer);

		expect('MailingStreet' in newContact).toBe(false);
		expect('MailingCity' in newContact).toBe(false);
		expect('MailingState' in newContact).toBe(false);
		expect('MailingPostalCode' in newContact).toBe(false);
		expect('MailingCountry' in newContact).toBe(false);

		expect(newContact.OtherStreet).toBe(buyerStreet);
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

		expect(recipientContact.MailingStreet).toBe(recipientStreet);
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
		expect(recipientContact.RecordTypeId).toBe(
			salesforceDeliveryOrRecipientRecordTypeId,
		);
	});

	test('createDigitalOnlyContactRecordRequest should have properties populated correctly', () => {
		const newContact = createDigitalOnlyContactRecordRequest(
			digitalOnlySubscriber,
		);

		expect('MailingStreet' in newContact).toBe(false);
		expect('MailingCity' in newContact).toBe(false);
		expect('MailingState' in newContact).toBe(false);
		expect('MailingPostalCode' in newContact).toBe(false);
		expect('MailingCountry' in newContact).toBe(false);

		expect('OtherStreet' in newContact).toBe(false);
		expect('OtherCity' in newContact).toBe(false);
		expect('OtherPostalCode' in newContact).toBe(false);

		expect('Salutation' in newContact).toBe(false);

		expect(newContact.OtherCountry).toBe('United Kingdom');

		expect(newContact.Email).toBe(digitalOnlySubscriber.primaryEmailAddress);
		expect(newContact.FirstName).toBe(digitalOnlySubscriber.firstName);
		expect(newContact.LastName).toBe(digitalOnlySubscriber.lastName);
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

describe('validGiftRecipientFields', () => {
	test('should return true when both firstName and lastName are present', () => {
		const validGiftRecipient = {
			title: 'Mr' as const,
			firstName: 'John',
			lastName: 'Doe',
			email: 'john.doe@example.com',
		};

		expect(validGiftRecipientFields(validGiftRecipient)).toBe(true);
	});

	test('should return false when firstName is empty string', () => {
		const invalidGiftRecipient = {
			title: 'Ms' as Title,
			firstName: '',
			lastName: 'Johnson',
			email: 'johnson@example.com',
		};

		expect(validGiftRecipientFields(invalidGiftRecipient)).toBe(false);
	});

	test('should return false when lastName is empty string', () => {
		const invalidGiftRecipient = {
			title: 'Dr' as Title,
			firstName: 'Robert',
			lastName: '',
			email: 'robert@example.com',
		};

		expect(validGiftRecipientFields(invalidGiftRecipient)).toBe(false);
	});

	test('should return false when both firstName and lastName are empty strings', () => {
		const invalidGiftRecipient = {
			title: 'Mrs' as Title,
			firstName: '',
			lastName: '',
			email: 'empty@example.com',
		};

		expect(validGiftRecipientFields(invalidGiftRecipient)).toBe(false);
	});
});

describe('buyerTypeIsPrint', () => {
	test('should return true when hasGiftRecipient is false and user.deliveryAddress is not null', () => {
		const hasGiftRecipient = false;
		expect(buyerTypeIsPrint(hasGiftRecipient, printSubscriber)).toBe(true);
	});

	test('should return false when hasGiftRecipient is true', () => {
		const hasGiftRecipient = true;
		expect(buyerTypeIsPrint(hasGiftRecipient, giftBuyer)).toBe(false);
	});

	test('should return false when no delivery address on user is true', () => {
		const hasGiftRecipient = false;
		expect(buyerTypeIsPrint(hasGiftRecipient, digitalOnlySubscriber)).toBe(
			false,
		);
	});
});

describe('createMailingAddressFields', () => {
	test('should create mailing address fields and set values correctly', () => {
		const expected = {
			MailingStreet: buyerStreet,
			MailingCity: printSubscriber.deliveryAddress.city,
			MailingState: printSubscriber.deliveryAddress.state,
			MailingPostalCode: printSubscriber.deliveryAddress.postCode,
			MailingCountry: 'United Kingdom',
		};

		const actual = createMailingAddressFields(printSubscriber);

		expect(actual).toEqual(expected);
	});
});

describe('createBillingAddressFields', () => {
	test('should create billing address fields and set values correctly', () => {
		const expected = {
			OtherStreet: buyerStreet,
			OtherCity: printSubscriber.billingAddress.city,
			OtherState: printSubscriber.billingAddress.state,
			OtherPostalCode: printSubscriber.billingAddress.postCode,
			OtherCountry: 'United Kingdom',
		};

		const actual = createBillingAddressFields(printSubscriber);

		expect(actual).toEqual(expected);
	});
});
