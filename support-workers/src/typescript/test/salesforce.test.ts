import {
	// createContactRecordRequest,
	SalesforceError,
	salesforceErrorCodes,
	SalesforceService,
} from '../services/salesforce';
// import { emailAddress, street, user } from './fixtures/salesforceFixtures';
// import { street, user } from './fixtures/salesforceFixtures';

describe('SalesforceService', () => {
	// test('getNewContact should only include delivery fields for purchases without a gift recipient', () => {
	// const newContactNoGift = createContactRecordRequest(user, null);
	// expect(newContactNoGift.MailingStreet).toBe(street);

	// const newContactWithGift = createContactRecordRequest(user, {
	// 	email: emailAddress,
	// 	title: 'Ms',
	// 	firstName: 'Jane',
	// 	lastName: 'Doe',
	// });
	// expect(newContactWithGift.MailingStreet).toBeNull();
	// });
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
