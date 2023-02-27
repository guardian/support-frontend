export const getForm: (arg0: string) => HTMLElement | null = (
	formName: string,
) => document.querySelector(`.${formName}`);

const getInvalidReason = (validityState: ValidityState) => {
	if (validityState.valueMissing) {
		return '-value-missing';
	} else if (validityState.patternMismatch) {
		return '-pattern-mismatch';
	}

	return '';
};

export const invalidReason = (form: Record<string, unknown> | null): string => {
	try {
		let invalidReasonString = '';

		if (form instanceof HTMLFormElement) {
			Array.from(form.elements).forEach((element) => {
				if (
					(element instanceof HTMLInputElement ||
						element instanceof HTMLSelectElement) &&
					!element.checkValidity()
				) {
					invalidReasonString += `-${element.id}${getInvalidReason(
						element.validity,
					)}`;
				}
			});
		} else {
			invalidReasonString = 'form-not-instance-of-html-element';
		}

		return invalidReasonString;
	} catch (e) {
		return 'unknown';
	}
};
