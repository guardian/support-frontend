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
