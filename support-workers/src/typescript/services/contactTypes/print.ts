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
