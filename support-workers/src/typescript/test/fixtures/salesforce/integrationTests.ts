import type { IsoCountry } from '@modules/internationalisation/country';
import type { PrintContactRecordRequest } from 'src/typescript/services/salesforce';
import type { Title } from '../../../model/stateSchemas';

export const idId = '9999999';
export const salesforceId = '003UD00000vTrY3YAK';
export const salesforceAccountId = '001UD00000SHvpuYAD';
export const emailAddress = 'integration-test@thegulocal.com';
export const telephoneNumber = '0123456789';
export const title: Title = 'Mrs';
export const name = 'integration-test';
export const street = '123 trash alley';
export const city = 'London';
export const postCode = 'n1 9gu';
export const uk: IsoCountry = 'GB';
export const state = 'CA';

export const customer: PrintContactRecordRequest = {
	IdentityID__c: idId,
	Email: emailAddress,
	FirstName: name,
	LastName: name,
	OtherCountry: uk,
};

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
};
