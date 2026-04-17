import { doesNotContainExtendedEmojiOrLeadingSpace } from 'pages/[countryGroupId]/validation';

const regexToValidate = new RegExp(
	doesNotContainExtendedEmojiOrLeadingSpace,
	// The v flag here replicates the way a pattern attribute is used in an input element
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern#overview
	'v',
);

describe('validateRegex', () => {
	it('leading space', () => {
		expect(' z').not.toMatch(regexToValidate);
		expect('z z').toMatch(regexToValidate);
	});
	it('pictographic', () => {
		expect('✈️z').not.toMatch(regexToValidate);
	});
	it('combined', () => {
		expect(' z✈️z').not.toMatch(regexToValidate);
		expect('✈️ z').not.toMatch(regexToValidate);
	});

	it('does not match a string consisting of only a Pictographic', () => {
		expect('♠').not.toMatch(regexToValidate);
	});

	it('does not match a string containing a Pictographic', () => {
		expect('hello ♠ hello').not.toMatch(regexToValidate);
	});

	it('does not match a string containing only an emoji', () => {
		expect('🇲🇾').not.toMatch(regexToValidate);
	});

	it('does not match a string containing an emoji', () => {
		expect('hello 🇲🇾 hello ').not.toMatch(regexToValidate);
	});
});
