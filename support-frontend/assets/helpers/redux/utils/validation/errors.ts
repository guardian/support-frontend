import type { ZodFormattedError } from 'zod';

type ValidateableState = Record<string, unknown>;

// The error structure for a slice that requires validation
// eg. { firstName: ['First name is too long'], email: ['Please enter your email'] }
export type SliceErrors<S extends ValidateableState> = Partial<
	Record<keyof S, string[]>
>;

export function getSliceErrorsFromZodResult<S extends ValidateableState>(
	validationResult: ZodFormattedError<S>,
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
