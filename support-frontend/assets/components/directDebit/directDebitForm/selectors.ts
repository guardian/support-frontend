import type { SliceErrors } from 'helpers/redux/utils/validation/errors';

type DirectDebitValidateableState = {
	sortCode: string;
	accountNumber: string;
	accountHolderName: string;
	accountHolderConfirmation: boolean;
};

type DirectDebitErrors = SliceErrors<DirectDebitValidateableState>;

export type DirectDebitFormDisplayErrors = DirectDebitErrors & {
	recaptcha?: string[];
};
