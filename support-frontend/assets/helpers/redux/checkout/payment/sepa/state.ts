import { z } from 'zod';
import type { SliceErrors } from 'helpers/redux/utils/validation/errors';

export const sepaSchema = z.object({
	iban: z
		.string()
		.regex(/[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}/, {
			message: 'Please enter a valid IBAN',
		}),
	accountHolderName: z
		.string()
		.min(1, 'Please provide your account holder name'),
	streetName: z.string().min(1, 'Please enter a billing address'),
	country: z.string().min(1, 'Please select a billing country'),
});

export type SepaValidateableState = z.infer<typeof sepaSchema>;

export type SepaState = SepaValidateableState & {
	errors: SliceErrors<SepaValidateableState>;
};

export const initialSepaState: SepaState = {
	iban: '',
	accountHolderName: '',
	streetName: '',
	country: '',
	errors: {},
};
