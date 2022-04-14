import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import type { Title } from 'helpers/user/details';
import { getUser } from 'helpers/user/user';

export type PersonalDetailsState = {
	title?: Title;
	firstName: string;
	lastName: string;
	email: string;
	confirmEmail?: string;
	isSignedIn: boolean;
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
	telephone?: string;
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
