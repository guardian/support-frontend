import { doesNotContainExtendedEmojiOrLeadingSpace } from 'pages/[countryGroupId]/validation';

describe('validateRegex', () => {
	it('leading space', () => {
		expect(matchRegex(doesNotContainExtendedEmojiOrLeadingSpace, ' z')).toEqual(
			false,
		);
		expect(
			matchRegex(doesNotContainExtendedEmojiOrLeadingSpace, 'z z'),
		).toEqual(true);
	});
	it('pictographic', () => {
		expect(
			matchRegex(doesNotContainExtendedEmojiOrLeadingSpace, '\\p✈️z'),
		).toEqual(false);
	});
	it('combined', () => {
		expect(
			matchRegex(doesNotContainExtendedEmojiOrLeadingSpace, ' z\\p✈️z'),
		).toEqual(false);
		expect(
			matchRegex(doesNotContainExtendedEmojiOrLeadingSpace, '\\p✈️ z'),
		).toEqual(false);
	});
});

// ----- Helpers ----- //

function matchRegex(regex: string, value: string): boolean {
	return new RegExp(regex).test(value);
}
