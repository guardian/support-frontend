import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import { getAddressLine } from '../../model/address';
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
		//	Email??
		AccountId: contactRecord.AccountId,
		Salutation: giftRecipient.title,
		FirstName: giftRecipient.firstName,
		LastName: giftRecipient.lastName,
		RecordTypeId: '01220000000VB50AAG',
		...createMailingAddressFields(user),
	};
};

export const createMailingAddressFields = (user: User) => {
	return {
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
