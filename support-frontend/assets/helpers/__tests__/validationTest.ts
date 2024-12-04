import { doesNotContainExtendedEmojiOrLeadingSpace } from 'pages/[countryGroupId]/validation';

const regexToValidate = new RegExp(doesNotContainExtendedEmojiOrLeadingSpace);

describe('validateRegex', () => {
	it('leading space', () => {
		expect(' z').not.toMatch(regexToValidate);
		expect('z z').toMatch(regexToValidate);
	});
	it('pictographic', () => {
		expect('\\p✈️z').not.toMatch(regexToValidate);
	});
	it('combined', () => {
		expect(' z\\p✈️z').not.toMatch(regexToValidate);
		expect('\\p✈️ z').not.toMatch(regexToValidate);
	});
});
