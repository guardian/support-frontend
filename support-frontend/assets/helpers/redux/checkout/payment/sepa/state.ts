import { z } from 'zod';
import type { SliceErrors } from 'helpers/redux/utils/validation/errors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- needed for the type below
const sepaSchema = z.object({
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

type SepaValidateableState = z.infer<typeof sepaSchema>;

export type SepaState = SepaValidateableState & {
	errors: SliceErrors<SepaValidateableState>;
};
