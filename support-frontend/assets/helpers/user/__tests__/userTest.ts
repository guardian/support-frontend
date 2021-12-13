import { getEmailValidatedFromUserCookie } from 'helpers/user/user';

jest.mock('ophan', () => () => ({}));

const toCookie = (values: Array<string | number | boolean>) =>
	`${Buffer.from(JSON.stringify(values)).toString(
		'base64',
	)}.the-secret-bit-that-we-ignore`;

describe('user tests', () => {
	it('should return false if no cookie', () => {
		expect(getEmailValidatedFromUserCookie(undefined)).toEqual(false);
	});
	it('should return false if cookie is invalid', () => {
		const cookie = toCookie(['1']);
		expect(getEmailValidatedFromUserCookie(cookie)).toEqual(false);
	});
	it('should return false if cookie contains false', () => {
		const cookie = toCookie(['1', '', 't f', '', 1, 1, 1, false]);
		expect(getEmailValidatedFromUserCookie(cookie)).toEqual(false);
	});
	it('should return true if cookie contains true', () => {
		const cookie = toCookie(['1', '', 't f', '', 1, 1, 1, true]);
		expect(getEmailValidatedFromUserCookie(cookie)).toEqual(true);
	});
});
