import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { DeliveryAgentState } from 'helpers/redux/checkout/addressMeta/state';

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
	if (!value) {
		return true;
	}
	return value.length < maxLength;
}

function zuoraCompatibleString(s: string | null | undefined): boolean {
	const takesFourBytesInUTF8Regex = /[\u{10000}-\u{10FFFF}]/u;

	if (!s) {
		return true;
	}

	return !takesFourBytesInUTF8Regex.test(s);
}

function requiredDeliveryAgentChosen(
	fulfilmentOption: FulfilmentOptions | null,
	deliveryAgent: DeliveryAgentState,
): boolean {
	if (
		fulfilmentOption === 'HomeDelivery' &&
		deliveryAgentsAreAvailable(deliveryAgent)
	) {
		return deliveryAgentHasBeenChosen(deliveryAgent);
	}

	return true;
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

function deliveryAgentHasBeenChosen(
	deliveryAgent: DeliveryAgentState,
): boolean {
	return deliveryAgent.chosenAgent ? true : false;
}

function deliveryAgentsAreAvailable(
	deliveryAgent: DeliveryAgentState,
): boolean {
	return (deliveryAgent.response?.agents?.length ?? 0) > 0;
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
	requiredDeliveryAgentChosen,
	deliveryAgentsAreAvailable,
};
