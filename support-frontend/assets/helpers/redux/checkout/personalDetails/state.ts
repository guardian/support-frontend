import { z } from 'zod';
import {
	maxLengths,
	zuoraCompatibleString,
} from 'helpers/redux/utils/validation/commonRules';
import type { SliceErrors } from 'helpers/redux/utils/validation/errors';
import { getUser } from 'helpers/user/user';

export type UserType = 'new' | 'guest' | 'current';

export type UserTypeFromIdentityResponse =
	| UserType
	| 'noRequestSent'
	| 'requestPending'
	| 'requestFailed';

export const emailRules = zuoraCompatibleString(
	z
		.string()
		.email('Please enter a valid email address.')
		.min(1, 'Please enter an email address.')
		.max(maxLengths.email, 'Email address is too long'),
);

export const personalDetailsSchema = z
	.object({
		title: z.optional(z.string()),
		firstName: zuoraCompatibleString(
			z
				.string()
				.min(1, { message: 'Please enter a first name.' })
				.max(maxLengths.name, { message: 'First name is too long' }),
		),
		lastName: zuoraCompatibleString(
			z
				.string()
				.min(1, 'Please enter a last name.')
				.max(maxLengths.name, 'Last name is too long'),
		),
		email: emailRules,
		confirmEmail: z.optional(z.string()),
		// isSignedIn is maintained in personal details state purely for the email matching check
		// It should be set only in response to the setIsSignedIn action from the user slice
		isSignedIn: z.boolean(),
		telephone: z.optional(zuoraCompatibleString(z.string())),
	})
	.refine(
		({ email, confirmEmail, isSignedIn }) => {
			return email === confirmEmail || isSignedIn;
		},
		{
			message: 'The email addresses do not match.',
			path: ['confirmEmail'],
		},
	);

type PersonalDetailsValidatedFields = z.infer<typeof personalDetailsSchema>;

export type PersonalDetailsState = PersonalDetailsValidatedFields & {
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
	errors?: SliceErrors<PersonalDetailsValidatedFields>;
};

const user = getUser();

export const initialPersonalDetailsState: PersonalDetailsState = {
	firstName: user.firstName ?? '',
	lastName: user.lastName ?? '',
	email: user.email ?? '',
	confirmEmail: '',
	isSignedIn: user.isSignedIn,
	userTypeFromIdentityResponse: 'noRequestSent',
	errors: {},
};
