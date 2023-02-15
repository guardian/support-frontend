import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { User } from 'helpers/user/user';

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
	isReturningContributor: boolean;
	isRecurringContributorError?: boolean;
};

const userInfo = getGlobal<User>('user');

export const initialState: UserState = {
	id: '',
	supporterStatus: {},
	isSignedIn: userInfo?.isSignedIn ?? false,
	isTestUser: false,
	isPostDeploymentTestUser: false,
	isStorybookUser: false,
	isReturningContributor: false,
};
