// ----- Types ----- //
export type Rule<Err> = {
	rule: boolean;
	error: Err;
};
export type FormError<FieldType> = {
	field: FieldType;
	message: string;
};

// ----- Rules ----- //
const nonEmptyString: (arg0: string | null | undefined) => boolean = (s) =>
	(s ?? '').trim() !== '';

function notNull<A>(value: A): boolean {
	return value !== null;
}

function notLongerThan(
	value: string | null | undefined,
	maxLength: number,
): boolean {
	if (!value) return true;
	return value.length < maxLength;
}

function zuoraCompatibleString(s: string | null | undefined): boolean {
	const takesFourBytesInUTF8Regex = /[\u{10000}-\u{10FFFF}]/u;

	if (!s) {
		return true;
	}

	return !takesFourBytesInUTF8Regex.test(s);
}

// ----- Functions ----- //
function firstError<FieldType>(
	field: FieldType,
	errors: Array<FormError<FieldType>>,
): string | undefined {
	const msgs: string[] = errors
		.filter((err) => err.field === field)
		.map((err) => err.message);
	return msgs[0];
}

function removeError<FieldType>(
	field: FieldType,
	formErrors: Array<FormError<FieldType>>,
): Array<FormError<FieldType>> {
	return formErrors.filter((error) => error.field !== field);
}

function formError<FieldType>(
	field: FieldType,
	message: string,
): FormError<FieldType> {
	return {
		field,
		message,
	};
}

function validate<Err>(rules: Array<Rule<Err>>): Err[] {
	return rules.reduce<Err[]>(
		(errors, { rule, error }) => (rule ? errors : [...errors, error]),
		[],
	);
}

// ----- Exports ----- //
export {
	nonEmptyString,
	notNull,
	notLongerThan,
	firstError,
	formError,
	removeError,
	validate,
	zuoraCompatibleString,
};
