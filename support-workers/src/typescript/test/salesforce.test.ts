import { createContactRecordRequest } from '../services/salesforce';
import { emailAddress, street, user } from './fixtures/salesforceFixtures';

describe('SalesforceService', () => {
	test('getNewContact should only include delivery fields for purchases without a gift recipient', () => {
		const newContactNoGift = createContactRecordRequest(user, null);
		expect(newContactNoGift.MailingStreet).toBe(street);

		const newContactWithGift = createContactRecordRequest(user, {
			email: emailAddress,
			title: 'Ms',
			firstName: 'Jane',
			lastName: 'Doe',
		});
		expect(newContactWithGift.MailingStreet).toBeNull();
	});
});
