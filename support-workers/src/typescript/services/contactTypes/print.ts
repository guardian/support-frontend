import { getAddressLine } from 'src/typescript/model/address';
import type { User } from 'src/typescript/model/stateSchemas';
import type { BaseContactRecordRequest } from './base';

export type PrintContactRecordRequest = BaseContactRecordRequest & {
	IdentityID__c: string;
	Email: string | null;
	OtherStreet: string | undefined;
	OtherCity: string | null;
	OtherState?: string | null;
	OtherPostalCode: string | null;
	OtherCountry: string | null;
	MailingStreet: string | undefined;
	MailingCity: string | null;
	MailingState: string | null;
	MailingPostalCode: string | null;
	MailingCountry: string | null;
};

export const createPrintContactRecordRequest = (
	user: User,
): PrintContactRecordRequest => {
	return {
		Salutation: user.title,
		FirstName: user.firstName,
		LastName: user.lastName,
		Phone: user.telephoneNumber,
		IdentityID__c: user.id,
		OtherStreet: getAddressLine(user.billingAddress),
		OtherCity: user.billingAddress.city,
		OtherState: user.billingAddress.state,
		OtherPostalCode: user.billingAddress.postCode,
		OtherCountry: getCountryNameByIsoCode(user.billingAddress.country),
		MailingStreet: getAddressLine(user.deliveryAddress),
		MailingCity: user.deliveryAddress.city,
		MailingState: user.deliveryAddress.state,
		MailingPostalCode: user.deliveryAddress.postCode,
		MailingCountry: getCountryNameByIsoCode(user.deliveryAddress.country),
	};
};
