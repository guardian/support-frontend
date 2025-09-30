import type { BaseContactRecordRequest } from './base';

export type DigitalOnlyContactRecordRequest = BaseContactRecordRequest & {
	RecordTypeId: '01220000000VB50AAG';
	Email: string | null;
	OtherState?: string | null;
	OtherPostalCode?: string | null;
	OtherCountry: string | null;
};
