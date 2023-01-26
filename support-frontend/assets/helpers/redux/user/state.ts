import { getGlobal } from 'helpers/globalsAndSwitches/globals';

type InitialUserInfo = {
	firstName?: string;
	lastName?: string;
	displayName?: string;
	email?: string;
	isSignedIn?: boolean;
};

export type UserType = 'new' | 'guest' | 'current';

export type UserTypeFromIdentityResponse =
	| UserType
	| 'noRequestSent'
	| 'requestPending'
	| 'requestFailed';

export type UserState = {
	id?: string;
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
	email: string;
	isTestUser: boolean;
	isPostDeploymentTestUser: boolean;
	isStorybookUser?: boolean;
	isSignedIn: boolean;
	isRecurringContributor: boolean;
	isReturningContributor: boolean;
	address4?: string;
	isRecurringContributorError?: boolean;
};

const userInfo = getGlobal<InitialUserInfo>('user') ?? {};

export const initialState: UserState = {
	id: '',
	userTypeFromIdentityResponse: 'noRequestSent',
	isSignedIn: userInfo.isSignedIn ?? false,
	email: userInfo.email ?? '',
	isTestUser: false,
	isPostDeploymentTestUser: false,
	isStorybookUser: false,
	// UNUSED
	isRecurringContributor: false,
	// UNUSED
	isReturningContributor: false,
};

/**
 * TODO
 * - How many of these properties do we ACTUALLY use?
 * - How many are never even set?
 * - isSignedIn duplicated in personal details- where should it live?
 * - isStorybookUser should be removed
 * - Better handling of returningContributor error?
 */
