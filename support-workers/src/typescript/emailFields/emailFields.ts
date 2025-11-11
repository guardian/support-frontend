import type { Dayjs } from 'dayjs';
import type { User } from '../model/stateSchemas';

export type ThankYouEmailFields = {
	To: {
		Address: string;
		ContactAttributes: {
			SubscriberAttributes: Record<string, string | undefined>;
		};
	};
	DataExtensionName: string;
	IdentityUserId: string;
	SfContactId?: string; // TODO: I don't think this is needed
};

export function buildThankYouEmailFields(
	user: User,
	dataExtensionName: string,
	productSpecificFields: Record<string, string | undefined>,
	sfContactId?: string,
) {
	return {
		To: {
			Address: user.primaryEmailAddress,
			ContactAttributes: {
				SubscriberAttributes: {
					...productSpecificFields,
				},
			},
		},
		DataExtensionName: dataExtensionName,
		IdentityUserId: user.id,
		...(sfContactId ? { SfContactId: sfContactId } : undefined),
	};
}

export function formatDate(date: Dayjs) {
	return date.format('dddd, D MMMM YYYY');
}
