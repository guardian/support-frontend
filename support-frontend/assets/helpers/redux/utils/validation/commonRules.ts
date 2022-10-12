import type { ZodEffects, ZodString } from 'zod';

export const maxLengths = {
	name: 40,
	email: 80,
};

const containsEmojiRegex = /\p{Emoji_Presentation}/u;

export function nonSillyString(
	zodString: ZodString,
	message = 'Please use only letters, numbers and punctuation.',
): ZodEffects<ZodString, string, string> {
	return zodString.refine((string) => !containsEmojiRegex.test(string), {
		message,
	});
}
