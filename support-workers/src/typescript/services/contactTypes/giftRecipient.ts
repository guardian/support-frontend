import type { BaseContactRecordRequest } from './base';

export type GiftRecipientContactRecordRequest = BaseContactRecordRequest & {
	AccountId: string;
	Email?: string | null;
	RecordTypeId: '01220000000VB50AAG';
	MailingStreet: string | null;
	MailingCity: string | null;
	MailingState?: string | null;
	MailingPostalCode: string | null;
	MailingCountry: string | null;
};
