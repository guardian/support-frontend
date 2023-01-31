import { getGlobal } from 'helpers/globalsAndSwitches/globals';

type InitialUserInfo = {
	firstName?: string;
	lastName?: string;
	displayName?: string;
	email?: string;
	isSignedIn?: boolean;
};

export type SupporterStatus = {
	member?: boolean;
	paidMember?: boolean;
	recurringContributor?: boolean;
	supporterPlus?: boolean;
	digitalPack?: boolean;
	paperSubscriber?: boolean;
	guardianWeeklySubscriber?: boolean;
	guardianPatron?: boolean;
};

export type UserState = {
	id?: string;
	supporterStatus: SupporterStatus;
	isTestUser: boolean;
	isPostDeploymentTestUser: boolean;
	isStorybookUser?: boolean;
	isSignedIn: boolean;
	isRecurringContributorError?: boolean;
};

const userInfo = getGlobal<InitialUserInfo>('user') ?? {};

export const initialState: UserState = {
	id: '',
	supporterStatus: {},
	isSignedIn: userInfo.isSignedIn ?? false,
	isTestUser: false,
	isPostDeploymentTestUser: false,
	isStorybookUser: false,
};
