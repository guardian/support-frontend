// ----- Imports ----- //
import * as cookie from 'helpers/storage/cookie';

export type User = {
	firstName?: string;
	lastName?: string;
	email?: string;
	isSignedIn: boolean;
	address4?: string;
};

// ----- Functions ----- //
function getUser(): User {
	if (window.guardian.user && window.guardian.user.email !== '') {
		const { firstName, lastName, email } = window.guardian.user;
		return {
			firstName: typeof firstName === 'string' ? firstName : undefined,
			lastName: typeof lastName === 'string' ? lastName : undefined,
			email: typeof email === 'string' ? email : undefined,
			isSignedIn: true,
		};
	}

	return {
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

const isPostDeployUser = (): boolean =>
	cookie.get('_post_deploy_user') === 'true';

// ----- Exports ----- //
export { getUser, isTestUser, isPostDeployUser };
