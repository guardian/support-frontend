import { getGlobal } from 'helpers/globalsAndSwitches/globals';

type InitialUserInfo = {
	firstName?: string;
	lastName?: string;
	displayName?: string;
	email?: string;
	isSignedIn?: boolean;
};

export type UserState = {
	id?: string;
	email: string;
	displayName?: string;
	firstName: string;
	lastName: string;
	fullName: string;
	isTestUser?: boolean;
	isPostDeploymentTestUser: boolean;
	isStorybookUser?: boolean;
	stateField: string;
	gnmMarketing: boolean;
	isSignedIn: boolean;
	isRecurringContributor: boolean;
	emailValidated: boolean;
	isReturningContributor: boolean;
	address4?: string;
	isRecurringContributorError?: boolean;
};

const userInfo = getGlobal<InitialUserInfo>('user') ?? {};

const fullName =
	userInfo.firstName && userInfo.lastName
		? `${userInfo.firstName} ${userInfo.lastName}`
		: '';

export const initialState: UserState = {
	id: '',
	email: userInfo.email ?? '',
	displayName: userInfo.displayName ?? '',
	firstName: userInfo.firstName ?? '',
	lastName: userInfo.lastName ?? '',
	fullName,
	stateField: '',
	isTestUser: false,
	isPostDeploymentTestUser: false,
	isStorybookUser: false,
	gnmMarketing: false,
	isSignedIn: userInfo.isSignedIn ?? false,
	isRecurringContributor: false,
	emailValidated: false,
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
