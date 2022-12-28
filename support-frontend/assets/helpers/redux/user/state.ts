import { getGlobal } from 'helpers/globalsAndSwitches/globals';

type InitialUserInfo = {
	firstName?: string;
	lastName?: string;
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

export const initialState: UserState = {
	id: '',
	email: userInfo.email ?? '',
	displayName: '',
	firstName: userInfo.firstName ?? '',
	lastName: userInfo.lastName ?? '',
	fullName: '',
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
