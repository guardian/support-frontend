import type { SliceErrors } from 'helpers/types/SliceErrors';

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
