import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import { getAddressLine } from '../../model/address';
import type { User } from '../../model/stateSchemas';
import type { BaseContactRecordRequest } from './base';

export type PrintContactRecordRequest = BaseContactRecordRequest & {
	IdentityID__c: string;
	Email: string | null;
	OtherStreet: string | null;
	OtherCity: string | null;
	OtherState?: string | null;
	OtherPostalCode: string | null;
	OtherCountry: string | null;
	MailingStreet: string | null;
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
		Email: user.primaryEmailAddress,
		IdentityID__c: user.id,
		OtherStreet: getAddressLine(user.billingAddress),
		OtherCity: user.billingAddress.city ?? null,
		OtherState: user.billingAddress.state ?? null,
		OtherPostalCode: user.billingAddress.postCode ?? null,
		OtherCountry: user.billingAddress.country
			? getCountryNameByIsoCode(user.billingAddress.country)
			: null,
		MailingStreet: user.deliveryAddress
			? getAddressLine(user.deliveryAddress)
			: null,
		MailingCity: user.deliveryAddress?.city ?? null,
		MailingState: user.deliveryAddress?.state ?? null,
		MailingPostalCode: user.deliveryAddress?.postCode ?? null,
		MailingCountry: user.deliveryAddress?.country
			? getCountryNameByIsoCode(user.deliveryAddress.country)
			: null,
	};
};
