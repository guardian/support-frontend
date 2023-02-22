import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { ContributionsDispatch } from 'helpers/redux/contributionsStore';
import type { SubscriptionsDispatch } from 'helpers/redux/subscriptionsStore';
import {
	setIsReturningContributor,
	setIsSignedIn,
	setTestUserStatus,
} from 'helpers/redux/user/actions';
import { get as getCookie } from 'helpers/storage/cookie';
import type { User } from './user';
import { isPostDeployUser, isTestUser } from './user';

export function setUpUserState(
	dispatch: ContributionsDispatch | SubscriptionsDispatch,
): void {
	const windowHasUser = getGlobal<User>('user');

	if (isTestUser()) {
		dispatch(
			setTestUserStatus({
				isTestUser: true,
				isPostDeploymentTestUser: isPostDeployUser(),
			}),
		);
	}

	if (getCookie('gu.contributions.contrib-timestamp')) {
		dispatch(setIsReturningContributor(true));
	}

	if (windowHasUser) {
		dispatch(setIsSignedIn(true));
	}
}
