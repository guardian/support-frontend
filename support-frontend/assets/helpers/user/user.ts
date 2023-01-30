// ----- Imports ----- //
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { ContributionsDispatch } from 'helpers/redux/contributionsStore';
import type { SubscriptionsDispatch } from 'helpers/redux/subscriptionsStore';
import {
	setIsReturningContributor,
	setIsSignedIn,
	setTestUserStatus,
} from 'helpers/redux/user/actions';
import type { UserState } from 'helpers/redux/user/state';
import * as cookie from 'helpers/storage/cookie';
import { get as getCookie } from 'helpers/storage/cookie';
import { getSession } from 'helpers/storage/storage';
import type { Option } from 'helpers/types/option';
import { getSignoutUrl } from 'helpers/urls/externalLinks';

export type User = {
	firstName: Option<string>;
	lastName: Option<string>;
	email: Option<string>;
	isSignedIn: boolean;
};

// ----- Functions ----- //
function getUser(): User {
	if (window.guardian.user && window.guardian.user.email !== '') {
		const { firstName, lastName, email } = window.guardian.user;
		return {
			firstName: typeof firstName === 'string' ? firstName : null,
			lastName: typeof lastName === 'string' ? lastName : null,
			email: typeof email === 'string' ? email : null,
			isSignedIn: true,
		};
	}

	return {
		firstName: null,
		lastName: null,
		email: null,
		isSignedIn: false,
	};
}

function isTestUser(): boolean {
	const isDefined = (x: boolean | string | null | undefined) =>
		x !== null && x !== undefined;

	const uatMode = window.guardian.uatMode;
	const testCookie = cookie.get('_test_username');
	return isDefined(uatMode) || isDefined(testCookie);
}

function getUserStateField(): string | undefined {
	const user = getGlobal<UserState>('user');
	if (user) {
		return user.address4 ?? window.guardian.geoip?.stateCode;
	}
	return window.guardian.geoip?.stateCode;
}

const isPostDeployUser = (): boolean =>
	cookie.get('_post_deploy_user') === 'true';

const signOut = (): void => {
	window.location.href = getSignoutUrl();
};

const doesUserAppearToBeSignedIn = (): boolean => !!cookie.get('GU_U');

// JTL: The user cookie is built to have particular values at
// particular indices by design. Index 7 in the cookie object represents
// whether a signed in user is validated or not. Though it's not ideal
// to grab values at unnamed indexes, this is a decision made a long
// time ago, on which a lot of other code relies, so it's unlikely
// there will be a breaking change affecting our base without some advance
// communication to a broader segment of engineering that also uses
// the user cookie.
const getEmailValidatedFromUserCookie = (
	guuCookie?: string | null,
): boolean => {
	if (guuCookie) {
		const tokens = guuCookie.split('.');

		try {
			const parsed = JSON.parse(
				Buffer.from(tokens[0], 'base64').toString(),
			) as unknown[];
			return !!parsed[7];
		} catch (e) {
			return false;
		}
	}

	return false;
};

function setUpUserState(
	dispatch: ContributionsDispatch | SubscriptionsDispatch,
): void {
	const windowHasUser = getGlobal<UserState>('user');
	const userAppearsLoggedIn = doesUserAppearToBeSignedIn();

	const emailFromBrowser = getGlobal<string>('email') ?? getSession('gu.email');

	/*
	 * Prevent use of the test stripe token if user is logged in, as support-workers will try it in live mode
	 * if the identity cookie is present
	 */
	const emailMatchesTestUser = (): boolean => {
		const testUsername = cookie.get('_test_username');

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

// ----- Exports ----- //
export {
	setUpUserState,
	getUser,
	isTestUser,
	isPostDeployUser,
	getUserStateField,
	signOut,
	doesUserAppearToBeSignedIn,
	getEmailValidatedFromUserCookie,
};
