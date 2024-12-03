// ----- Imports ----- //
import { doesNotContainExtendedEmojiOrLeadingSpace } from './validation';

export function testRegex(regex: string, value: string): boolean {
	return new RegExp(regex).test(value);
}

// ----- Tests ----- //
describe('validationRegex', () => {
	it('leading space', () => {
		expect(testRegex(doesNotContainExtendedEmojiOrLeadingSpace, ' ')).toEqual(
			false,
		);
		expect(testRegex(doesNotContainExtendedEmojiOrLeadingSpace, ' z')).toEqual(
			false,
		);
		expect(testRegex(doesNotContainExtendedEmojiOrLeadingSpace, 'z ')).toEqual(
			true,
		);
		expect(testRegex(doesNotContainExtendedEmojiOrLeadingSpace, 'z z')).toEqual(
			true,
		);
	});
	it('pictographic', () => {
		expect(testRegex(doesNotContainExtendedEmojiOrLeadingSpace, '✈️')).toEqual(
			false,
		);
		expect(
			testRegex(doesNotContainExtendedEmojiOrLeadingSpace, '✈️✈️'),
		).toEqual(false);
		expect(testRegex(doesNotContainExtendedEmojiOrLeadingSpace, '✈️z')).toEqual(
			false,
		);
		expect(
			testRegex(doesNotContainExtendedEmojiOrLeadingSpace, 'z✈️ '),
		).toEqual(false);
		expect(
			testRegex(doesNotContainExtendedEmojiOrLeadingSpace, 'z✈️z'),
		).toEqual(false);
		expect(
			testRegex(doesNotContainExtendedEmojiOrLeadingSpace, 'z✈️✈️z '),
		).toEqual(false);
	});
	it('combined', () => {
		expect(testRegex(doesNotContainExtendedEmojiOrLeadingSpace, ' ✈️')).toEqual(
			false,
		);
		expect(testRegex(doesNotContainExtendedEmojiOrLeadingSpace, '✈️ ')).toEqual(
			false,
		);
		expect(
			testRegex(doesNotContainExtendedEmojiOrLeadingSpace, 'z✈️ '),
		).toEqual(false);
		expect(
			testRegex(doesNotContainExtendedEmojiOrLeadingSpace, ' ✈️z'),
		).toEqual(false);
	});
});
