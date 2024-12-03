export function preventDefaultValidityMessage(
	currentTarget: HTMLInputElement | HTMLSelectElement,
) {
	/**
	 * Prevents default message showing, but maintains the default validation methods occuring
	 * such as onInvalid.
	 */
	// 3. Reset the value from previous invalid events
	currentTarget.setCustomValidity('');
	// 1. Check the validity of the input
	if (!currentTarget.validity.valid) {
		// 2. setCustomValidity to " " which avoids the browser's default message
		currentTarget.setCustomValidity(' ');
	}
}

/**
 * This uses a Unicode character class escape
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape
 */
export const doesNotContainExtendedEmojiOrLeadingSpace =
	'^[^\\p{Extended_Pictographic}\\s].[^\\p{Extended_Pictographic}]*$';
