import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import type { Title } from 'helpers/user/details';

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

export const initialPersonalDetailsState: PersonalDetailsState = {
	firstName: '',
	lastName: '',
	email: '',
	isSignedIn: false,
	userTypeFromIdentityResponse: 'noRequestSent',
};
