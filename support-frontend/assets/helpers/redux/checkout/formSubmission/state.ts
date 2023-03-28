import type { ErrorReason } from 'helpers/forms/errorReasons';

export type FormSubmissionStatus = 'unsent' | 'pending' | 'success' | 'error';

export type FormSubmissionState = {
	status: FormSubmissionStatus;
	error?: ErrorReason;
};

export const initialState: FormSubmissionState = {
	status: 'unsent',
};
