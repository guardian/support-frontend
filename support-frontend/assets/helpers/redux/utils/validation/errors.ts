type ValidateableState = Record<string, unknown>;

// The error structure for a slice that requires validation
// eg. { firstName: ['First name is too long'], email: ['Please enter your email'] }
export type SliceErrors<S extends ValidateableState> = Partial<
	Record<keyof S, string[]>
>;
