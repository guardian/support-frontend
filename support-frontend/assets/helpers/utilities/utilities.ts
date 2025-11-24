import DomPurify from 'dompurify';
import snarkdown from 'snarkdown';

// A series of general purpose helper functions.
// ----- Functions ----- //
// Ascending comparison function for use with Array.prototype.sort.
function ascending(a: number, b: number): number {
	return a - b;
}

// Converts a number to a given number of decimal places, default two.
function roundToDecimalPlaces(num: number, dps = 2): number {
	return Math.round(num * 10 ** dps) / 10 ** dps;
}

// Generates the "class class-modifier" string for HTML elements.
// Does not add null, undefined and empty string.
function classNameWithModifiers(
	className: string,
	modifiers: Array<string | null | undefined>,
): string {
	const validModifiers = modifiers.filter(Boolean) as string[];

	return validModifiers.reduce(
		(acc, modifier) => `${acc} ${className}--${modifier}`,
		className,
	);
}

function hiddenIf(shouldHide: boolean, className: string): string {
	return shouldHide ? classNameWithModifiers(className, ['hidden']) : className;
}

// Deserialises a JSON object from a string.
function deserialiseJsonObject(
	serialised: string,
): Record<string, unknown> | null | undefined {
	try {
		const deserialised: unknown = JSON.parse(serialised);

		if (deserialised instanceof Object && !(deserialised instanceof Array)) {
			return deserialised as Record<string, unknown>;
		}

		return null;
	} catch (err) {
		return null;
	}
}

function getSanitisedHtml(markdownString: string): string {
	// ensure we don't accidentally inject dangerous html into the page
	return DomPurify.sanitize(snarkdown(markdownString), {
		ALLOWED_TAGS: ['em', 'strong', 'ul', 'li', 'a', 'p'],
	});
}

// Automate days remaining copy where campaign has a countdown in the page
// relies on the countdown updating state in the 3 tier landing page component
const DEADLINE_PLACEHOLDER_TEMPLATE = '%%CAMPAIGN_DEADLINE%%';
function replaceDatePlaceholder(copy: string, deadline?: string): string {
	if (!copy.includes(DEADLINE_PLACEHOLDER_TEMPLATE)) {
		return copy;
	}

	if (deadline === undefined || !/^\d+$/.test(deadline)) {
		return copy.replaceAll(DEADLINE_PLACEHOLDER_TEMPLATE, '');
	}

	const daysLeft = parseInt(deadline);

	let replacement = '';

	if (daysLeft === 0) {
		replacement = 'Final day';
	} else if (daysLeft === 1) {
		replacement = '1 day left';
	} else {
		replacement = `${daysLeft} days left`;
	}

	return copy.replaceAll(DEADLINE_PLACEHOLDER_TEMPLATE, replacement);
}

// Parses a comma-separated string of amounts and returns an array of valid, unique numbers.
// Filters out invalid values (NaN, negative, zero, infinite) and removes duplicates.
function parseCustomAmounts(customAmountsParam: string): number[] {
	return customAmountsParam
		.split(',')
		.map((amount) => parseFloat(amount.trim()))
		.filter((amount) => !isNaN(amount) && isFinite(amount) && amount > 0)
		.filter((amount, index, array) => array.indexOf(amount) === index);
}

// ----- Exports ----- //
export {
	ascending,
	getSanitisedHtml,
	roundToDecimalPlaces,
	classNameWithModifiers,
	hiddenIf,
	deserialiseJsonObject,
	parseCustomAmounts,
	replaceDatePlaceholder,
};
