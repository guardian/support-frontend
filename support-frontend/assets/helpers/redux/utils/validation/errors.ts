import type { WritableDraft } from 'immer/dist/internal';
import type { z } from 'zod';

type ValidateableState = Record<string, unknown>;

// The error structure for a slice that requires validation
// eg. { firstName: ['First name is too long'], email: ['Please enter your email'] }
export type SliceErrors<S extends ValidateableState> = Partial<
	Record<keyof S, string[]>
>;

export function getSliceErrorsFromZodResult<S extends ValidateableState>(
	validationResult: z.ZodFormattedError<S>,
): SliceErrors<S> {
	return Object.keys(validationResult).reduce<SliceErrors<S>>(
		(formattedResult, key) => {
			const resultForKey = validationResult[key];
			if (resultForKey && key !== '_errors') {
				return {
					...formattedResult,
					[key]: resultForKey._errors,
				};
			}
			return formattedResult;
		},
		{},
	);
}

type Schema =
	| z.ZodEffects<z.ZodObject<z.ZodRawShape>>
	| z.ZodObject<z.ZodRawShape>;

type SliceStateWithErrors = ValidateableState & {
	errors?: SliceErrors<ValidateableState>;
};

// Create a handler for the validateForm action for any Redux slice which needs to store errors
export function createSliceValidatorFor(schema: Schema) {
	return function validateStateSlice(
		state: WritableDraft<SliceStateWithErrors>,
	): void {
		const validationResult = schema.safeParse(state);
		if (!validationResult.success) {
			state.errors = getSliceErrorsFromZodResult(
				validationResult.error.format(),
			);
		}
	};
}
