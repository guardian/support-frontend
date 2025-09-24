import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import { getAddressLine } from 'src/typescript/model/address';
import type { GiftRecipient, User } from '../../model/stateSchemas';
import type { SalesforceContactRecord } from '../salesforce';
import type { BaseContactRecordRequest } from './base';

export type GiftRecipientContactRecordRequest = BaseContactRecordRequest & {
	AccountId: string;
	RecordTypeId: '01220000000VB50AAG';
	MailingStreet: string | null;
	MailingCity: string | null;
	MailingState: string | null;
	MailingPostalCode: string | null;
	MailingCountry: string | null;
};

export const createGiftRecipientContactRecordRequest = (
	contactRecord: SalesforceContactRecord,
	giftRecipient: GiftRecipient,
	user: User,
): GiftRecipientContactRecordRequest => {
	return {
		AccountId: contactRecord.AccountId,
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
