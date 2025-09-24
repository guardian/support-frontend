import type { Title } from 'src/typescript/model/stateSchemas';

export type BaseContactRecordRequest = {
	Salutation?: Title | null;
	FirstName: string;
	LastName: string;
	Phone?: string | null;
};
