import { storage } from '@guardian/libs';
import type {
	FormAddressFields,
	FormPersonalFields,
} from './formDataExtractors';

export type PersistableFormFields = {
	personalData: FormPersonalFields;
	addressFields: FormAddressFields;
};

const oneDayInMillis = 24 * 60 * 60 * 1000;

export const persistFormDetails = (
	checkoutSessionId: string,
	formDetails: PersistableFormFields,
): void => {
	const dataToPersist = {
		formDetails,
		version: 1,
		checkoutSessionId,
	};

	const expiry = Date.now() + oneDayInMillis;

	storage.session.set('checkoutSessionFormData', dataToPersist, expiry);
};
