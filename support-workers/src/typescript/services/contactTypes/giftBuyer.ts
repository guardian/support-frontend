import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import { getAddressLine } from '../../model/address';
import type { User } from '../../model/stateSchemas';
import type { BaseContactRecordRequest } from './base';

export type GiftBuyerContactRecordRequest = BaseContactRecordRequest & {
	IdentityID__c: string;
	Email: string | null;
	OtherStreet: string | null;
	OtherCity: string | null;
	OtherState?: string | null;
	OtherPostalCode: string | null;
	OtherCountry: string | null;
};

export const createGiftBuyerContactRecordRequest = (
	user: User,
): GiftBuyerContactRecordRequest => {
	return {
		IdentityID__c: user.id,
		Email: user.primaryEmailAddress,
		Salutation: user.title,
		FirstName: user.firstName,
		LastName: user.lastName,
		Phone: user.telephoneNumber,
		OtherStreet: getAddressLine(user.billingAddress),
		OtherCity: user.billingAddress.city,
		OtherState: user.billingAddress.state,
		OtherPostalCode: user.billingAddress.postCode,
		OtherCountry: getCountryNameByIsoCode(user.billingAddress.country),
	};
};
