import type { ZodEffects, ZodString } from 'zod';
import { z } from 'zod';

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

export const emailRules = nonSillyString(
	z
		.string()
		.email('Please enter a valid email address.')
		.min(1, 'Please enter an email address.')
		.max(maxLengths.email, 'Email address is too long'),
);
