import { doesNotContainExtendedEmojiOrLeadingSpace } from 'pages/[countryGroupId]/validation';

describe('validateRegex', () => {
	it('leading space', () => {
		expect(' z').not.toMatch(
			new RegExp(doesNotContainExtendedEmojiOrLeadingSpace),
		);
		expect('z z').toMatch(
			new RegExp(doesNotContainExtendedEmojiOrLeadingSpace),
		);
	});
	it('pictographic', () => {
		expect('\\p✈️z').not.toMatch(
			new RegExp(doesNotContainExtendedEmojiOrLeadingSpace),
		);
	});
	it('combined', () => {
		expect(' z\\p✈️z').not.toMatch(
			new RegExp(doesNotContainExtendedEmojiOrLeadingSpace),
		);
		expect('\\p✈️ z').not.toMatch(
			new RegExp(doesNotContainExtendedEmojiOrLeadingSpace),
		);
	});
});
