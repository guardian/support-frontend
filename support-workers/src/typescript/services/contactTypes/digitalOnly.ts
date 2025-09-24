import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import type { User } from '../../model/stateSchemas';
import type { BaseContactRecordRequest } from './base';

export type DigitalOnlyContactRecordRequest = BaseContactRecordRequest & {
	RecordTypeId: '01220000000VB50AAG';
	Email: string | null;
	OtherState?: string | null;
	OtherPostalCode?: string | null;
	OtherCountry: string | null;
};

export const createDigitalOnlyContactRecordRequest = (
	user: User,
): DigitalOnlyContactRecordRequest => {
	return {
		Email: user.primaryEmailAddress,
		Salutation: user.title,
		FirstName: user.firstName,
		LastName: user.lastName,
		Phone: user.telephoneNumber,
		RecordTypeId: '01220000000VB50AAG',
		OtherCountry: getCountryNameByIsoCode(user.billingAddress.country),
		...(user.billingAddress.state
			? { OtherState: user.billingAddress.state }
			: {}),
		...(user.billingAddress.postCode
			? { OtherPostalCode: user.billingAddress.postCode }
			: {}),
	};
};
