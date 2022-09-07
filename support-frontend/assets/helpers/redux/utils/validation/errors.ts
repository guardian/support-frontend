import type { ZodFormattedError } from 'zod';

// The error structure for a slice that requires validation
// eg. { firstName: ['First name is too long'], email: ['Please enter your email'] }
export type SliceErrors<ValidatableSliceState> = Partial<
	Record<keyof ValidatableSliceState, string[]>
>;

export function getSliceErrorsFromZodResult<
	StateType extends Record<string, unknown>,
>(validationResult: ZodFormattedError<StateType>): SliceErrors<StateType> {
	return Object.keys(validationResult).reduce<SliceErrors<StateType>>(
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
