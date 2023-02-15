// ----- Imports ----- //
import type { ThunkDispatch } from 'redux-thunk';
import * as cookie from 'helpers/storage/cookie';
import { get as getCookie } from 'helpers/storage/cookie';
import { getSession } from 'helpers/storage/storage';
import type { Option } from 'helpers/types/option';
import { getSignoutUrl } from 'helpers/urls/externalLinks';
import { routes } from 'helpers/urls/routes';
import { defaultUserActionFunctions } from 'helpers/user/defaultUserActionFunctions';
import type { Action, UserSetStateActions } from 'helpers/user/userActions';

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

const init = (
	dispatch: ThunkDispatch<User, void, Action>,
	actions: UserSetStateActions = defaultUserActionFunctions,
): void => {
	const {
		setId,
		setDisplayName,
		setFirstName,
		setLastName,
		setFullName,
		setIsSignedIn,
		setEmail,
		setStateField,
		setIsRecurringContributor,
		setTestUser,
		setPostDeploymentTestUser,
		setEmailValidated,
		setIsReturningContributor,
	} = actions;
	const windowHasUser = window.guardian.user;
	const userAppearsLoggedIn = doesUserAppearToBeSignedIn();

	function getEmailFromBrowser(): string | null | undefined {
		return window.guardian.email ?? getSession('gu.email');
	}

	const emailFromBrowser = getEmailFromBrowser();

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
		dispatch(setTestUser(true));
	}

	if (isTestUser() && isPostDeployUser()) {
		dispatch(setPostDeploymentTestUser(true));
	}

	if (getCookie('gu.contributions.contrib-timestamp')) {
		dispatch(setIsReturningContributor(true));
	}

	if (windowHasUser) {
		const { id, email, displayName, firstName, lastName, address4 } =
			windowHasUser;

		id && dispatch(setId(id));
		email && dispatch(setEmail(email));
		displayName && dispatch(setDisplayName(displayName));
		firstName && dispatch(setFirstName(firstName));
		lastName && dispatch(setLastName(lastName));
		dispatch(setFullName(`${firstName} ${lastName}`));

		// default value from Identity Billing Address, or Fastly GEO-IP
		if (address4) {
			dispatch(setStateField(address4));
		} else {
			window.guardian.geoip?.stateCode &&
				dispatch(setStateField(window.guardian.geoip.stateCode));
		}

		dispatch(setIsSignedIn(true));
		dispatch(
			setEmailValidated(getEmailValidatedFromUserCookie(cookie.get('GU_U'))),
		);
		void fetch(`${window.guardian.mdapiUrl}/user-attributes/me`, {
			mode: 'cors',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((attributes: Record<string, unknown>) => {
				if (attributes.recurringContributionPaymentPlan) {
					dispatch(setIsRecurringContributor());
				}
			});
	} else if (userAppearsLoggedIn) {
		// TODO - remove in another PR as this condition is deprecated
		void fetch(routes.oneOffContribAutofill, {
			credentials: 'include',
		}).then((response) => {
			if (response.ok) {
				void response.json().then((data: Record<string, string>) => {
					if (data.id) {
						dispatch(setIsSignedIn(true));
						dispatch(setId(data.id));
					}

					if (data.name) {
						dispatch(setFullName(data.name));
					}

					if (data.email) {
						dispatch(setEmail(data.email));
					}

					if (data.displayName) {
						dispatch(setDisplayName(data.displayName));
					}
				});
			}
		});
	} else {
		if (emailFromBrowser) {
			dispatch(setEmail(emailFromBrowser));
		}

		window.guardian.geoip?.stateCode &&
			dispatch(setStateField(window.guardian.geoip.stateCode));
	}
};

// ----- Exports ----- //
export {
	init,
	getUser,
	isTestUser,
	isPostDeployUser,
	signOut,
	doesUserAppearToBeSignedIn,
	getEmailValidatedFromUserCookie,
};
