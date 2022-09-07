import { z } from 'zod';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
// import type { Title } from 'helpers/user/details';
import { getUser } from 'helpers/user/user';

const maxLengths = {
	name: 40,
	email: 80,
};

const containsEmojiRegex = /\p{Emoji_Presentation}/u;

const nonSillyString = (zodString: z.ZodString) =>
	zodString.refine((string) => !containsEmojiRegex.test(string), {
		message: 'Please use only letters, numbers and punctuation.',
	});

export const personalDetailsSchema = z
	.object({
		title: z.optional(z.string()),
		firstName: nonSillyString(
			z
				.string()
				.min(1, { message: 'Please enter a first name.' })
				.max(maxLengths.name, { message: 'First name is too long' }),
		),
		lastName: nonSillyString(
			z
				.string()
				.min(1, 'Please enter a last name.')
				.max(maxLengths.name, 'Last name is too long'),
		),
		email: z
			.string()
			.email('Please enter a valid email address.')
			.min(1, 'Please enter an email address.')
			.max(maxLengths.email, 'Email address is too long'),
		confirmEmail: z.optional(z.string()),
		telephone: z.optional(nonSillyString(z.string())),
	})
	.refine(({ email, confirmEmail }) => email === confirmEmail, {
		message: 'The email addresses do not match.',
		path: ['confirmEmail'],
	});

export type PersonalDetailsState = z.infer<typeof personalDetailsSchema> & {
	isSignedIn: boolean;
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
};

const user = getUser();

export const initialPersonalDetailsState: PersonalDetailsState = {
	firstName: user.firstName ?? '',
	lastName: user.lastName ?? '',
	email: user.email ?? '',
	confirmEmail: '',
	isSignedIn: user.isSignedIn,
	userTypeFromIdentityResponse: 'noRequestSent',
};
