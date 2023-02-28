import type { ZodEffects, ZodString } from 'zod';

export const maxLengths = {
	name: 40,
	email: 80,
};

const takesFourBytesInUTF8Regex = /[\u{10000}-\u{10FFFF}]/u;

export function zuoraCompatibleString(
	zodString: ZodString,
	message = 'Please use only letters, numbers and punctuation.',
): ZodEffects<ZodString, string, string> {
	return zodString.refine((string) => !takesFourBytesInUTF8Regex.test(string), {
		message,
	});
}
