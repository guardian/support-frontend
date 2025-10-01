import { Title } from '../../model/stateSchemas';
import { IsoCountry } from '@modules/internationalisation/country';

export const idId = '9999999';
export const salesforceId = '003UD00000VZnteYAD';
export const salesforceAccountId = '001UD00000Gk8XeYAJ';
export const emailAddress = 'integration-test@thegulocal.com';
export const telephoneNumber = '0123456789';
export const title: Title = 'Mrs';
export const name = 'integration-test';
export const street = '123 trash alley';
export const city = 'London';
export const postCode = 'n1 9gu';
export const uk: IsoCountry = 'GB';
export const state = 'CA';

// export const customer: ContactRecordRequest = {
// 	IdentityID__c: idId,
// 	Email: emailAddress,
// 	Salutation: title,
// 	FirstName: name,
// 	LastName: name,
// 	OtherStreet: null,
// 	OtherCity: null,
// 	OtherState: null,
// 	OtherPostalCode: null,
// 	OtherCountry: uk,
// 	MailingStreet: null,
// 	MailingCity: null,
// 	MailingState: null,
// 	MailingPostalCode: null,
// 	MailingCountry: null,
// 	Phone: null,
// };

const address = {
	lineOne: street,
	city,
	state,
	postCode,
	country: uk,
};

export const user = {
	id: idId,
	firstName: name,
	lastName: name,
	title,
	primaryEmailAddress: emailAddress,
	telephoneNumber,
	billingAddress: address,
	deliveryAddress: address,
	isTestUser: false,
	deliveryInstructions: null,
};
