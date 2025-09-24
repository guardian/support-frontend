import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import { getAddressLine } from 'src/typescript/model/address';
import type { GiftRecipient, User } from 'src/typescript/model/stateSchemas';
import type { SalesforceContactRecord } from '../salesforce';
import type { BaseContactRecordRequest } from './base';

export type GiftBuyerContactRecordRequest = BaseContactRecordRequest & {
	IdentityID__c: string;
	Email: string | null;
	OtherStreet: string | undefined;
	OtherCity: string | null;
	OtherState?: string | null;
	OtherPostalCode: string | null;
	OtherCountry: string | null;
};

export const createGiftBuyerContactRecordRequest = (
	contactRecord: SalesforceContactRecord,
	giftRecipient: GiftRecipient,
	user: User,
): GiftBuyerContactRecordRequest => {
	return {
		AccountId: contactRecord.AccountId,
		Email: giftRecipient.email, // is this correct for a gift buyer?
		Salutation: giftRecipient.title,
		FirstName: giftRecipient.firstName,
		LastName: giftRecipient.lastName,
		MailingStreet: getAddressLine(user.deliveryAddress),
		MailingCity: user.deliveryAddress.city,
		MailingState: user.deliveryAddress.state,
		MailingPostalCode: user.deliveryAddress.postCode,
		MailingCountry: getCountryNameByIsoCode(user.deliveryAddress.country),
	};
};
