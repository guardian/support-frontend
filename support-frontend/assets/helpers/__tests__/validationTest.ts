import { doesNotContainExtendedEmojiOrLeadingSpace } from 'pages/[countryGroupId]/validation';

const regexValidation = new RegExp(doesNotContainExtendedEmojiOrLeadingSpace);

describe('validateRegex', () => {
	it('leading space', () => {
		expect(' z').not.toMatch(regexValidation);
		expect('z z').toMatch(regexValidation);
	});
	it('pictographic', () => {
		expect('\\p✈️z').not.toMatch(regexValidation);
	});
	it('combined', () => {
		expect(' z\\p✈️z').not.toMatch(regexValidation);
		expect('\\p✈️ z').not.toMatch(regexValidation);
	});
});
