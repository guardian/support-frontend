// ----- Imports ----- //
import { getGlobal, isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import * as cookie from 'helpers/storage/cookie';
import type { Option } from 'helpers/types/option';

export type User = {
	firstName: Option<string>;
	lastName: Option<string>;
	email: Option<string>;
	isSignedIn: boolean;
	address4?: string;
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

	const testMode = window.guardian.testMode;
	const testCookie = cookie.get('_test_username');
	return isDefined(testMode) || isDefined(testCookie);
}

function getUserStateField(): string | undefined {
	const user = getGlobal<User>('user');
	return user?.address4;
}

const isPostDeployUser = (): boolean =>
	cookie.get('_post_deploy_user') === 'true';

const signOut = (): void => {
	window.location.href =
		'https://support.code.dev-theguardian.com/subscribe/paper/checkout?promoCode=NATIONAL-TEST&fulfilment=HomeDelivery&product=Everyday';
};

const doesUserAppearToBeSignedIn = (): boolean =>
	isSwitchOn('featureSwitches.authenticateWithOkta')
		? !!cookie.get('GU_ID_TOKEN')
		: !!cookie.get('GU_U');

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

// ----- Exports ----- //
export {
	getUser,
	isTestUser,
	isPostDeployUser,
	getUserStateField,
	signOut,
	doesUserAppearToBeSignedIn,
	getEmailValidatedFromUserCookie,
};
