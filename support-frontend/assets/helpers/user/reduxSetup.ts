import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { ContributionsDispatch } from 'helpers/redux/contributionsStore';
import type { SubscriptionsDispatch } from 'helpers/redux/subscriptionsStore';
import {
	setIsReturningContributor,
	setIsSignedIn,
	setTestUserStatus,
} from 'helpers/redux/user/actions';
import { get as getCookie } from 'helpers/storage/cookie';
import { getSession } from 'helpers/storage/storage';
import type { User } from './user';
import {
	doesUserAppearToBeSignedIn,
	isPostDeployUser,
	isTestUser,
} from './user';

export function setUpUserState(
	dispatch: ContributionsDispatch | SubscriptionsDispatch,
): void {
	const windowHasUser = getGlobal<User>('user');
	const userAppearsLoggedIn = doesUserAppearToBeSignedIn();

	const emailFromBrowser = getGlobal<string>('email') ?? getSession('gu.email');

	/*
	 * Prevent use of the test stripe token if user is logged in, as support-workers will try it in live mode
	 * if the identity cookie is present
	 */
	const emailMatchesTestUser = (): boolean => {
		const testUsername = getCookie('_test_username');

		if (emailFromBrowser && testUsername) {
			return emailFromBrowser
				.toLowerCase()
				.startsWith(testUsername.toLowerCase());
		}

		return false;
	};

	if (isTestUser() && (!userAppearsLoggedIn || emailMatchesTestUser())) {
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
