import { z } from 'zod';
import type { SliceErrors } from 'helpers/redux/utils/validation/errors';

export type Phase = 'entry' | 'confirmation';

const numericStringRegex = /^\d+$/;

export const directDebitSchema = z.object({
	sortCode: z
		.string()
		.length(6, 'Please enter your sort code')
		.regex(numericStringRegex, 'Please enter a valid sort code'),
	accountNumber: z
		.string()
		.min(1, 'Please enter your account number')
		.regex(numericStringRegex, 'Please enter a valid account number'),
	accountHolderName: z
		.string()
		.min(1, 'Please provide your account holder name'),
	accountHolderConfirmation: z.boolean().refine((confirmed) => confirmed, {
		message: 'Please confirm you are the account holder',
	}),
});

export type DirectDebitValidateableState = z.infer<typeof directDebitSchema>;

export type DirectDebitState = DirectDebitValidateableState & {
	isPopUpOpen: boolean;
	isDDGuaranteeOpen: boolean;
	formError: string;
	phase: Phase;
	errors?: SliceErrors<DirectDebitValidateableState>;
};

export const initialDirectDebitState: DirectDebitState = {
	isPopUpOpen: false,
	isDDGuaranteeOpen: false,
	sortCode: '',
	accountNumber: '',
	accountHolderName: '',
	accountHolderConfirmation: false,
	formError: '',
	phase: 'entry',
};
